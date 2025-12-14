import express from 'express';
import { PrismaClient } from '@prisma/client';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET all active vacancies (public - only non-expired)
router.get('/', async (req, res) => {
    try {
        const vacancies = await prisma.vacancy.findMany({
            where: {
                deadline: {
                    gte: new Date() // Only future or today's deadlines
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Parse images JSON for each vacancy
        const vacanciesWithImages = vacancies.map(vacancy => ({
            ...vacancy,
            images: vacancy.images ? JSON.parse(vacancy.images) : []
        }));

        res.json(vacanciesWithImages);
    } catch (error) {
        console.error('Error fetching vacancies:', error);
        res.status(500).json({ message: 'Error fetching vacancies' });
    }
});

// GET all vacancies including expired (admin only)
router.get('/all', auth, async (req, res) => {
    try {
        const vacancies = await prisma.vacancy.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Parse images JSON for each vacancy
        const vacanciesWithImages = vacancies.map(vacancy => ({
            ...vacancy,
            images: vacancy.images ? JSON.parse(vacancy.images) : []
        }));

        res.json(vacanciesWithImages);
    } catch (error) {
        console.error('Error fetching all vacancies:', error);
        res.status(500).json({ message: 'Error fetching vacancies' });
    }
});

// GET single vacancy by slug
router.get('/:slug', async (req, res) => {
    const { slug } = req.params;

    try {
        const vacancy = await prisma.vacancy.findUnique({
            where: { slug }
        });

        if (!vacancy) {
            return res.status(404).json({ message: 'Vacancy not found' });
        }

        // Parse images JSON
        const vacancyWithImages = {
            ...vacancy,
            images: vacancy.images ? JSON.parse(vacancy.images) : []
        };

        res.json(vacancyWithImages);
    } catch (error) {
        console.error('Error fetching vacancy:', error);
        res.status(500).json({ message: 'Error fetching vacancy' });
    }
});

// POST create new vacancy (admin only, with images)
router.post('/', auth, upload.array('images', 5), async (req, res) => {
    try {
        const { title, slug, department, location, type, description, requirements, deadline } = req.body;

        // Collect uploaded image paths
        const imagePaths = req.files ? req.files.map(file => `/uploads/vacancies/${file.filename}`) : [];

        const vacancy = await prisma.vacancy.create({
            data: {
                title,
                slug,
                department,
                location,
                type,
                description,
                requirements,
                deadline: new Date(deadline),
                images: imagePaths.length > 0 ? JSON.stringify(imagePaths) : null
            }
        });

        // Parse images JSON for response
        const vacancyWithImages = {
            ...vacancy,
            images: vacancy.images ? JSON.parse(vacancy.images) : []
        };

        res.status(201).json(vacancyWithImages);
    } catch (error) {
        console.error('Error creating vacancy:', error);
        res.status(500).json({ message: 'Error creating vacancy' });
    }
});

// PUT update vacancy (admin only, with images)
router.put('/:id', auth, upload.array('images', 5), async (req, res) => {
    const { id } = req.params;

    try {
        const { title, slug, department, location, type, description, requirements, deadline, existingImages } = req.body;

        // Parse existing images if provided
        let existingImagesList = [];
        if (existingImages) {
            try {
                existingImagesList = JSON.parse(existingImages);
            } catch (e) {
                existingImagesList = [];
            }
        }

        // Collect newly uploaded image paths
        const newImagePaths = req.files ? req.files.map(file => `/uploads/vacancies/${file.filename}`) : [];

        // Combine existing and new images
        const allImages = [...existingImagesList, ...newImagePaths];

        const vacancy = await prisma.vacancy.update({
            where: { id: parseInt(id) },
            data: {
                title,
                slug,
                department,
                location,
                type,
                description,
                requirements,
                deadline: new Date(deadline),
                images: allImages.length > 0 ? JSON.stringify(allImages) : null
            }
        });

        // Parse images JSON for response
        const vacancyWithImages = {
            ...vacancy,
            images: vacancy.images ? JSON.parse(vacancy.images) : []
        };

        res.json(vacancyWithImages);
    } catch (error) {
        console.error('Error updating vacancy:', error);
        res.status(500).json({ message: 'Error updating vacancy' });
    }
});

// DELETE vacancy (admin only)
router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.vacancy.delete({
            where: { id: parseInt(id) }
        });

        res.json({ message: 'Vacancy deleted successfully' });
    } catch (error) {
        console.error('Error deleting vacancy:', error);
        res.status(500).json({ message: 'Error deleting vacancy' });
    }
});

export default router;
