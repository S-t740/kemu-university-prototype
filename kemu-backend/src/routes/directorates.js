import express from 'express';
import prisma from '../utils/prisma.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all directorates
router.get('/', async (req, res) => {
    try {
        const directorates = await prisma.directorate.findMany({
            orderBy: {
                name: 'asc'
            }
        });
        res.json(directorates);
    } catch (error) {
        console.error('Error fetching directorates:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get directorate by ID
router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const directorate = await prisma.directorate.findUnique({
            where: { id }
        });

        if (!directorate) {
            return res.status(404).json({ message: 'Directorate not found' });
        }

        res.json(directorate);
    } catch (error) {
        console.error('Error fetching directorate:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Create directorate (admin only)
router.post('/', authenticate, async (req, res) => {
    try {
        const { name, slug, overview } = req.body;

        if (!name || !slug) {
            return res.status(400).json({ message: 'Name and slug are required' });
        }

        const directorate = await prisma.directorate.create({
            data: {
                name,
                slug,
                overview
            }
        });

        res.status(201).json(directorate);
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ message: 'Slug already exists' });
        }
        console.error('Error creating directorate:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update directorate (admin only)
router.put('/:id', authenticate, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { name, slug, overview } = req.body;

        const directorate = await prisma.directorate.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(slug && { slug }),
                ...(overview !== undefined && { overview })
            }
        });

        res.json(directorate);
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Directorate not found' });
        }
        if (error.code === 'P2002') {
            return res.status(400).json({ message: 'Slug already exists' });
        }
        console.error('Error updating directorate:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete directorate (admin only)
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await prisma.directorate.delete({
            where: { id }
        });
        res.json({ message: 'Directorate deleted successfully' });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Directorate not found' });
        }
        console.error('Error deleting directorate:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
