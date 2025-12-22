import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'applicant-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

// Middleware to verify applicant JWT token
export const authenticateApplicant = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.applicant = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

// POST /api/applicant/register - Create new applicant account (no OTP verification)
router.post('/register', async (req, res) => {
    try {
        const { email, password, firstName, lastName, phone, phoneCode, nationalId } = req.body;

        // Validation
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ error: 'Email, password, first name, and last name are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Check if email already exists
        const existingApplicant = await prisma.applicant.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (existingApplicant) {
            return res.status(400).json({ error: 'An account with this email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create applicant (already verified, no OTP needed)
        const applicant = await prisma.applicant.create({
            data: {
                email: email.toLowerCase(),
                password: hashedPassword,
                firstName,
                lastName,
                phone: phone || null,
                phoneCode: phoneCode || '+254',
                nationalId: nationalId || null,
                isVerified: true  // Directly verified, no OTP
            }
        });

        // Generate JWT token for immediate login
        const token = jwt.sign(
            { id: applicant.id, email: applicant.email, type: 'applicant' },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            token,
            applicant: {
                id: applicant.id,
                email: applicant.email,
                firstName: applicant.firstName,
                lastName: applicant.lastName,
                phone: applicant.phone,
                phoneCode: applicant.phoneCode
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Failed to create account' });
    }
});


// POST /api/applicant/login - Login applicant
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find applicant
        const applicant = await prisma.applicant.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (!applicant) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, applicant.password);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: applicant.id, email: applicant.email, type: 'applicant' },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            applicant: {
                id: applicant.id,
                email: applicant.email,
                firstName: applicant.firstName,
                lastName: applicant.lastName,
                phone: applicant.phone,
                phoneCode: applicant.phoneCode,
                nationalId: applicant.nationalId
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
});

// GET /api/applicant/me - Get current applicant profile
router.get('/me', authenticateApplicant, async (req, res) => {
    try {
        const applicant = await prisma.applicant.findUnique({
            where: { id: req.applicant.id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                phoneCode: true,
                nationalId: true,
                isVerified: true,
                createdAt: true
            }
        });

        if (!applicant) {
            return res.status(404).json({ error: 'Applicant not found' });
        }

        res.json({ success: true, applicant });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to get profile' });
    }
});

// PUT /api/applicant/profile - Update applicant profile
router.put('/profile', authenticateApplicant, async (req, res) => {
    try {
        const { firstName, lastName, phone, phoneCode, nationalId } = req.body;

        const updatedApplicant = await prisma.applicant.update({
            where: { id: req.applicant.id },
            data: {
                firstName: firstName || undefined,
                lastName: lastName || undefined,
                phone: phone || undefined,
                phoneCode: phoneCode || undefined,
                nationalId: nationalId || undefined
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                phoneCode: true,
                nationalId: true
            }
        });

        res.json({ success: true, applicant: updatedApplicant });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// GET /api/applicant/applications - Get all applications for current applicant
router.get('/applications', authenticateApplicant, async (req, res) => {
    try {
        const applications = await prisma.studentApplication.findMany({
            where: { applicantId: req.applicant.id },
            include: {
                program: {
                    select: {
                        id: true,
                        title: true,
                        degreeType: true,
                        duration: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Calculate stats
        const stats = {
            total: applications.length,
            pending: applications.filter(a => ['new', 'received', 'reviewing'].includes(a.status)).length,
            offered: applications.filter(a => a.status === 'offered').length,
            rejected: applications.filter(a => a.status === 'rejected').length
        };

        res.json({
            success: true,
            applications,
            stats
        });
    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({ error: 'Failed to get applications' });
    }
});

// POST /api/applicant/change-password - Change password
router.post('/change-password', authenticateApplicant, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'New password must be at least 6 characters' });
        }

        // Get current applicant
        const applicant = await prisma.applicant.findUnique({
            where: { id: req.applicant.id }
        });

        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, applicant.password);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update password
        await prisma.applicant.update({
            where: { id: req.applicant.id },
            data: { password: hashedPassword }
        });

        res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Failed to change password' });
    }
});

// POST /api/applicant/link-application - Link existing application to account
router.post('/link-application', authenticateApplicant, async (req, res) => {
    try {
        const { applicationId, email, nationalId } = req.body;

        if (!applicationId) {
            return res.status(400).json({ error: 'Application ID is required' });
        }

        // Find the application
        const application = await prisma.studentApplication.findUnique({
            where: { applicationId }
        });

        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        // Verify ownership (email or national ID must match)
        const applicant = await prisma.applicant.findUnique({
            where: { id: req.applicant.id }
        });

        const emailMatch = application.email.toLowerCase() === applicant.email.toLowerCase();
        const nationalIdMatch = nationalId && application.nationalId === nationalId;

        if (!emailMatch && !nationalIdMatch) {
            return res.status(403).json({ error: 'Cannot link this application. Email or National ID does not match.' });
        }

        // Check if already linked
        if (application.applicantId) {
            if (application.applicantId === req.applicant.id) {
                return res.status(400).json({ error: 'Application is already linked to your account' });
            }
            return res.status(403).json({ error: 'This application is linked to another account' });
        }

        // Link the application
        await prisma.studentApplication.update({
            where: { applicationId },
            data: { applicantId: req.applicant.id }
        });

        res.json({ success: true, message: 'Application linked successfully' });
    } catch (error) {
        console.error('Link application error:', error);
        res.status(500).json({ error: 'Failed to link application' });
    }
});

export default router;
