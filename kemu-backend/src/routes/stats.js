import express from 'express';
import prisma from '../utils/prisma.js';

const router = express.Router();

// Get stats
router.get('/', async (req, res) => {
    try {
        const [programsCount, newsCount, eventsCount] = await Promise.all([
            prisma.program.count(),
            prisma.news.count(),
            prisma.event.count()
        ]);

        const stats = {
            programs: programsCount,
            news: newsCount,
            events: eventsCount,
            students: 32000, // Static for now
            campuses: 3 // Static
        };

        res.json(stats);
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
