import express from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import authenticate from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const prisma = new PrismaClient();

// Configure multer for document uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../uploads/student-applications');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF, JPG, PNG, DOC, DOCX allowed.'));
        }
    }
});

// Generate unique application ID
const generateApplicationId = async (institution) => {
    const prefix = institution === 'TVET' ? 'TVET' : 'KEMU';
    const year = new Date().getFullYear();

    // Find the last application for this institution and year
    const lastApp = await prisma.studentApplication.findFirst({
        where: {
            applicationId: {
                startsWith: `${prefix}-${year}-`
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    let nextNum = 1;
    if (lastApp) {
        const lastNum = parseInt(lastApp.applicationId.split('-')[2], 10);
        nextNum = lastNum + 1;
    }

    return `${prefix}-${year}-${String(nextNum).padStart(5, '0')}`;
};

// ==================== PUBLIC ENDPOINTS ====================

// Upload documents (can be called multiple times during wizard)
router.post('/upload', upload.fields([
    { name: 'passportPhoto', maxCount: 1 },
    { name: 'nationalIdDoc', maxCount: 1 },
    { name: 'academicCerts', maxCount: 10 },
    { name: 'supportingDocs', maxCount: 10 }
]), async (req, res) => {
    try {
        const uploadedFiles = {};

        if (req.files) {
            for (const [fieldName, files] of Object.entries(req.files)) {
                if (files.length === 1) {
                    uploadedFiles[fieldName] = `/uploads/student-applications/${files[0].filename}`;
                } else {
                    uploadedFiles[fieldName] = files.map(f => `/uploads/student-applications/${f.filename}`);
                }
            }
        }

        res.json({ success: true, files: uploadedFiles });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload files' });
    }
});

// Submit new student application
router.post('/', async (req, res) => {
    try {
        const {
            // Applicant Profile
            firstName,
            lastName,
            email,
            phoneCode,
            phone,
            nationalId,
            dateOfBirth,
            nationality,
            physicalAddress,
            // Programme Selection
            programId,
            intake,
            applicationType,
            kuccpsRefNumber,
            sponsorDetails,
            // Education History
            educationHistory,
            // Documents
            passportPhoto,
            nationalIdDoc,
            academicCerts,
            supportingDocs,
            // Payment
            paymentReference,
            paymentMethod,
            mpesaReceiptNumber,
            // Consent
            declarationAccepted,
            privacyConsent,
            // Institution
            institution = 'KEMU'
        } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !phone || !programId || !intake || !applicationType) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Verify program exists
        const program = await prisma.program.findUnique({
            where: { id: parseInt(programId) }
        });

        if (!program) {
            return res.status(400).json({ error: 'Invalid program selected' });
        }

        // Generate application ID
        const applicationId = await generateApplicationId(institution);

        // Create the application
        const application = await prisma.studentApplication.create({
            data: {
                applicationId,
                firstName,
                lastName,
                email,
                phoneCode: phoneCode || '+254',
                phone,
                nationalId,
                dateOfBirth: new Date(dateOfBirth),
                nationality: nationality || 'Kenyan',
                physicalAddress,
                programId: parseInt(programId),
                intake,
                applicationType,
                kuccpsRefNumber,
                sponsorDetails,
                educationHistory: typeof educationHistory === 'string' ? educationHistory : JSON.stringify(educationHistory || []),
                passportPhoto,
                nationalIdDoc,
                academicCerts: typeof academicCerts === 'string' ? academicCerts : JSON.stringify(academicCerts || []),
                supportingDocs: typeof supportingDocs === 'string' ? supportingDocs : JSON.stringify(supportingDocs || []),
                paymentReference,
                paymentMethod,
                mpesaReceiptNumber,
                paymentStatus: paymentReference ? 'paid' : 'pending',
                declarationAccepted: Boolean(declarationAccepted),
                privacyConsent: Boolean(privacyConsent),
                institution,
                status: 'new',
                submittedAt: new Date()
            },
            include: {
                program: {
                    include: { school: true }
                }
            }
        });

        res.status(201).json({
            success: true,
            applicationId: application.applicationId,
            message: 'Application submitted successfully',
            application
        });
    } catch (error) {
        console.error('Application submission error:', error);
        res.status(500).json({ error: 'Failed to submit application' });
    }
});

// Check application status (public - by applicationId)
router.get('/:applicationId/status', async (req, res) => {
    try {
        const { applicationId } = req.params;

        const application = await prisma.studentApplication.findUnique({
            where: { applicationId },
            select: {
                applicationId: true,
                firstName: true,
                lastName: true,
                email: true,
                status: true,
                paymentStatus: true,
                submittedAt: true,
                updatedAt: true,
                program: {
                    select: {
                        title: true,
                        degreeType: true
                    }
                }
            }
        });

        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        res.json(application);
    } catch (error) {
        console.error('Status check error:', error);
        res.status(500).json({ error: 'Failed to check application status' });
    }
});

// ==================== ADMIN ENDPOINTS ====================

// Get all applications (admin only)
router.get('/admin/all', authenticate, async (req, res) => {
    try {
        const {
            institution,
            status,
            intake,
            programId,
            search,
            page = 1,
            limit = 20
        } = req.query;

        const where = {};

        if (institution) where.institution = institution;
        if (status) where.status = status;
        if (intake) where.intake = intake;
        if (programId) where.programId = parseInt(programId);

        if (search) {
            where.OR = [
                { firstName: { contains: search } },
                { lastName: { contains: search } },
                { email: { contains: search } },
                { applicationId: { contains: search } },
                { nationalId: { contains: search } }
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [applications, total] = await Promise.all([
            prisma.studentApplication.findMany({
                where,
                include: {
                    program: {
                        include: { school: true }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: parseInt(limit)
            }),
            prisma.studentApplication.count({ where })
        ]);

        res.json({
            applications,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Admin fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
});

// Get application statistics (admin only)
router.get('/admin/stats', authenticate, async (req, res) => {
    try {
        const { institution } = req.query;
        const where = institution ? { institution } : {};

        const [total, byStatus, byIntake, recent] = await Promise.all([
            prisma.studentApplication.count({ where }),
            prisma.studentApplication.groupBy({
                by: ['status'],
                where,
                _count: { status: true }
            }),
            prisma.studentApplication.groupBy({
                by: ['intake'],
                where,
                _count: { intake: true }
            }),
            prisma.studentApplication.count({
                where: {
                    ...where,
                    createdAt: {
                        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
                    }
                }
            })
        ]);

        const statusCounts = byStatus.reduce((acc, item) => {
            acc[item.status] = item._count.status;
            return acc;
        }, {});

        const intakeCounts = byIntake.reduce((acc, item) => {
            acc[item.intake] = item._count.intake;
            return acc;
        }, {});

        res.json({
            total,
            recentWeek: recent,
            byStatus: statusCounts,
            byIntake: intakeCounts
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// Get single application detail (admin only)
router.get('/admin/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;

        const application = await prisma.studentApplication.findUnique({
            where: { id: parseInt(id) },
            include: {
                program: {
                    include: { school: true }
                }
            }
        });

        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        res.json(application);
    } catch (error) {
        console.error('Detail fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch application details' });
    }
});

// Update application status (admin only)
router.put('/admin/:id/status', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminNotes } = req.body;

        const validStatuses = ['new', 'received', 'reviewing', 'shortlisted', 'offered', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const application = await prisma.studentApplication.update({
            where: { id: parseInt(id) },
            data: {
                status,
                ...(adminNotes && { adminNotes })
            },
            include: {
                program: true
            }
        });

        res.json({
            success: true,
            message: 'Status updated successfully',
            application
        });
    } catch (error) {
        console.error('Status update error:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
});

// Add admin notes (admin only)
router.post('/admin/:id/notes', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { notes } = req.body;

        const application = await prisma.studentApplication.update({
            where: { id: parseInt(id) },
            data: {
                adminNotes: notes
            }
        });

        res.json({
            success: true,
            message: 'Notes added successfully',
            application
        });
    } catch (error) {
        console.error('Notes update error:', error);
        res.status(500).json({ error: 'Failed to add notes' });
    }
});

// Update payment status (admin only - for fee waiver)
router.put('/admin/:id/payment', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { paymentStatus, paymentReference } = req.body;

        const validStatuses = ['pending', 'paid', 'waived'];
        if (!validStatuses.includes(paymentStatus)) {
            return res.status(400).json({ error: 'Invalid payment status' });
        }

        const application = await prisma.studentApplication.update({
            where: { id: parseInt(id) },
            data: {
                paymentStatus,
                ...(paymentReference && { paymentReference })
            }
        });

        res.json({
            success: true,
            message: 'Payment status updated',
            application
        });
    } catch (error) {
        console.error('Payment update error:', error);
        res.status(500).json({ error: 'Failed to update payment status' });
    }
});

// Delete application (admin only)
router.delete('/admin/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.studentApplication.delete({
            where: { id: parseInt(id) }
        });

        res.json({
            success: true,
            message: 'Application deleted successfully'
        });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'Failed to delete application' });
    }
});

// ==================== MPESA STK PUSH (STUB) ====================

// Initiate MPESA STK Push (stub implementation)
router.post('/payment/mpesa/stk-push', async (req, res) => {
    try {
        const { phone, amount, applicationId } = req.body;

        if (!phone || !amount || !applicationId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // In production, this would integrate with Safaricom Daraja API
        // For now, return a stub response
        const checkoutRequestId = `ws_CO_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Simulate STK push initiated
        res.json({
            success: true,
            message: 'STK push initiated. Please check your phone.',
            checkoutRequestId,
            // In production: CustomerMessage, MerchantRequestID, ResponseCode, ResponseDescription
            stub: true,
            instructions: [
                'This is a DEMO - No actual payment will be processed',
                'In production, you would receive an M-PESA prompt on your phone',
                'Enter your M-PESA PIN to complete the transaction',
                'After payment, enter the confirmation code below'
            ]
        });
    } catch (error) {
        console.error('MPESA STK push error:', error);
        res.status(500).json({ error: 'Failed to initiate payment' });
    }
});

// Verify MPESA payment (stub implementation)
router.post('/payment/mpesa/verify', async (req, res) => {
    try {
        const { checkoutRequestId, mpesaReceiptNumber, applicationId } = req.body;

        if (!mpesaReceiptNumber || !applicationId) {
            return res.status(400).json({ error: 'Missing receipt number or application ID' });
        }

        // Find application by applicationId string
        const application = await prisma.studentApplication.findUnique({
            where: { applicationId }
        });

        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        // In production, verify with Safaricom API
        // For stub, accept any receipt number that matches pattern
        const isValidReceipt = /^[A-Z0-9]{10,}$/i.test(mpesaReceiptNumber);

        if (!isValidReceipt) {
            return res.status(400).json({
                error: 'Invalid receipt number format',
                hint: 'Enter a valid M-PESA confirmation code (e.g., QJK7H5M2F9)'
            });
        }

        // Update application with payment info
        await prisma.studentApplication.update({
            where: { applicationId },
            data: {
                paymentStatus: 'paid',
                paymentMethod: 'MPESA',
                mpesaReceiptNumber,
                paymentReference: mpesaReceiptNumber
            }
        });

        res.json({
            success: true,
            message: 'Payment verified successfully',
            paymentStatus: 'paid'
        });
    } catch (error) {
        console.error('MPESA verify error:', error);
        res.status(500).json({ error: 'Failed to verify payment' });
    }
});

export default router;
