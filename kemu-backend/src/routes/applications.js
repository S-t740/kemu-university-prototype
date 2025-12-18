import express from 'express';
import { PrismaClient } from '@prisma/client';
import auth from '../middleware/auth.js';
import { documentUpload } from '../middleware/upload.js';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const prisma = new PrismaClient();

// Configure multer for application uploads (CV and documents)
const applicationUpload = documentUpload.fields([
    { name: 'cv', maxCount: 1 },
    { name: 'documents', maxCount: 5 }
]);

// POST /api/applications - Submit a new application (public)
router.post('/', applicationUpload, async (req, res) => {
    try {
        const { vacancyId, firstName, lastName, email, phone, coverLetter } = req.body;

        // Validate required fields
        if (!vacancyId || !firstName || !lastName || !email || !phone || !coverLetter) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if CV was uploaded
        if (!req.files || !req.files.cv || req.files.cv.length === 0) {
            return res.status(400).json({ error: 'CV is required' });
        }

        // Check if vacancy exists and is still open
        const vacancy = await prisma.vacancy.findUnique({
            where: { id: parseInt(vacancyId) }
        });

        if (!vacancy) {
            return res.status(404).json({ error: 'Vacancy not found' });
        }

        if (new Date(vacancy.deadline) < new Date()) {
            return res.status(400).json({ error: 'Application deadline has passed' });
        }

        // Get file paths (files are stored in uploads/applications/)
        const cvPath = '/uploads/applications/' + req.files.cv[0].filename;

        // Handle additional documents
        let documents = null;
        if (req.files.documents && req.files.documents.length > 0) {
            documents = JSON.stringify(
                req.files.documents.map(file => '/uploads/applications/' + file.filename)
            );
        }

        // Create application
        const application = await prisma.application.create({
            data: {
                vacancyId: parseInt(vacancyId),
                firstName,
                lastName,
                email,
                phone,
                coverLetter,
                cvPath,
                documents,
                status: 'pending'
            },
            include: {
                vacancy: {
                    select: { title: true, department: true }
                }
            }
        });

        res.status(201).json({
            message: 'Application submitted successfully',
            application
        });
    } catch (error) {
        console.error('Error submitting application:', error);
        res.status(500).json({ error: 'Failed to submit application' });
    }
});

// GET /api/applications - Get all applications (admin only)
router.get('/', auth, async (req, res) => {
    try {
        const { status, vacancyId, search, institution, excludeInstitution } = req.query;

        const where = {};

        if (status && status !== 'all') {
            where.status = status;
        }

        if (vacancyId) {
            where.vacancyId = parseInt(vacancyId);
        }

        // Filter by vacancy institution (include only)
        if (institution) {
            where.vacancy = {
                institution: institution
            };
        }

        // Exclude applications from a specific institution
        if (excludeInstitution) {
            where.vacancy = {
                ...where.vacancy,
                NOT: {
                    institution: excludeInstitution
                }
            };
        }

        if (search) {
            where.OR = [
                { firstName: { contains: search } },
                { lastName: { contains: search } },
                { email: { contains: search } }
            ];
        }

        const applications = await prisma.application.findMany({
            where,
            include: {
                vacancy: {
                    select: { id: true, title: true, department: true, slug: true, institution: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(applications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
});



// GET /api/applications/stats - Get application statistics (admin only)
router.get('/stats', auth, async (req, res) => {
    try {
        const stats = await prisma.application.groupBy({
            by: ['status'],
            _count: { status: true }
        });

        const total = await prisma.application.count();

        res.json({ stats, total });
    } catch (error) {
        console.error('Error fetching application stats:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// GET /api/applications/vacancy/:vacancyId - Get applications for a specific vacancy
router.get('/vacancy/:vacancyId', auth, async (req, res) => {
    try {
        const { vacancyId } = req.params;

        const applications = await prisma.application.findMany({
            where: { vacancyId: parseInt(vacancyId) },
            include: {
                vacancy: {
                    select: { title: true, department: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(applications);
    } catch (error) {
        console.error('Error fetching applications for vacancy:', error);
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
});

// GET /api/applications/:id - Get single application details
router.get('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;

        const application = await prisma.application.findUnique({
            where: { id: parseInt(id) },
            include: {
                vacancy: true
            }
        });

        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        res.json(application);
    } catch (error) {
        console.error('Error fetching application:', error);
        res.status(500).json({ error: 'Failed to fetch application' });
    }
});

// PUT /api/applications/:id/status - Update application status (admin only)
router.put('/:id/status', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminNotes } = req.body;

        const validStatuses = ['pending', 'reviewing', 'shortlisted', 'interview', 'rejected', 'hired'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                error: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
            });
        }

        const application = await prisma.application.update({
            where: { id: parseInt(id) },
            data: {
                status,
                adminNotes: adminNotes || undefined
            },
            include: {
                vacancy: {
                    select: { title: true, department: true }
                }
            }
        });

        res.json({
            message: 'Application status updated',
            application
        });
    } catch (error) {
        console.error('Error updating application status:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Application not found' });
        }
        res.status(500).json({ error: 'Failed to update application' });
    }
});

// DELETE /api/applications/:id - Delete application (admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;

        // Get application to find files to delete
        const application = await prisma.application.findUnique({
            where: { id: parseInt(id) }
        });

        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        // Delete associated files
        const uploadsDir = path.join(process.cwd(), 'uploads');

        // Delete CV
        if (application.cvPath) {
            const cvFilePath = path.join(uploadsDir, path.basename(application.cvPath));
            if (fs.existsSync(cvFilePath)) {
                fs.unlinkSync(cvFilePath);
            }
        }

        // Delete additional documents
        if (application.documents) {
            const docs = JSON.parse(application.documents);
            docs.forEach(docPath => {
                const filePath = path.join(uploadsDir, path.basename(docPath));
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            });
        }

        // Delete application record
        await prisma.application.delete({
            where: { id: parseInt(id) }
        });

        res.json({ message: 'Application deleted successfully' });
    } catch (error) {
        console.error('Error deleting application:', error);
        res.status(500).json({ error: 'Failed to delete application' });
    }
});

export default router;
