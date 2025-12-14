import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET all student services (public)
router.get('/', async (req, res) => {
    try {
        const services = await prisma.studentService.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' }
        });

        // Parse JSON details field for each service
        const parsed = services.map(s => ({
            ...s,
            details: s.details ? JSON.parse(s.details) : []
        }));

        res.json(parsed);
    } catch (error) {
        console.error('Error fetching student services:', error);
        res.status(500).json({ error: 'Failed to fetch student services' });
    }
});

// GET single student service by slug (public)
router.get('/:slug', async (req, res) => {
    try {
        const service = await prisma.studentService.findUnique({
            where: { slug: req.params.slug }
        });

        if (!service) {
            return res.status(404).json({ error: 'Student service not found' });
        }

        res.json({
            ...service,
            details: service.details ? JSON.parse(service.details) : []
        });
    } catch (error) {
        console.error('Error fetching student service:', error);
        res.status(500).json({ error: 'Failed to fetch student service' });
    }
});

// POST create new student service (admin only)
router.post('/', authenticate, async (req, res) => {
    try {
        const { slug, title, summary, details, url, sortOrder, isActive } = req.body;

        if (!slug || !title || !summary) {
            return res.status(400).json({ error: 'Slug, title, and summary are required' });
        }

        const service = await prisma.studentService.create({
            data: {
                slug,
                title,
                summary,
                details: Array.isArray(details) ? JSON.stringify(details) : details || null,
                url: url || null,
                sortOrder: sortOrder || 0,
                isActive: isActive !== undefined ? isActive : true
            }
        });

        res.status(201).json({
            ...service,
            details: service.details ? JSON.parse(service.details) : []
        });
    } catch (error) {
        console.error('Error creating student service:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'A service with this slug already exists' });
        }
        res.status(500).json({ error: 'Failed to create student service' });
    }
});

// PUT update student service (admin only)
router.put('/:id', authenticate, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { slug, title, summary, details, url, sortOrder, isActive } = req.body;

        const updateData = {};
        if (slug !== undefined) updateData.slug = slug;
        if (title !== undefined) updateData.title = title;
        if (summary !== undefined) updateData.summary = summary;
        if (details !== undefined) updateData.details = Array.isArray(details) ? JSON.stringify(details) : details;
        if (url !== undefined) updateData.url = url;
        if (sortOrder !== undefined) updateData.sortOrder = sortOrder;
        if (isActive !== undefined) updateData.isActive = isActive;

        const service = await prisma.studentService.update({
            where: { id },
            data: updateData
        });

        res.json({
            ...service,
            details: service.details ? JSON.parse(service.details) : []
        });
    } catch (error) {
        console.error('Error updating student service:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Student service not found' });
        }
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'A service with this slug already exists' });
        }
        res.status(500).json({ error: 'Failed to update student service' });
    }
});

// DELETE student service (admin only)
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        await prisma.studentService.delete({
            where: { id }
        });

        res.json({ message: 'Student service deleted successfully' });
    } catch (error) {
        console.error('Error deleting student service:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Student service not found' });
        }
        res.status(500).json({ error: 'Failed to delete student service' });
    }
});

export default router;
