import express from 'express';
import prisma from '../utils/prisma.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all schools
router.get('/', async (req, res) => {
  try {
    const schools = await prisma.school.findMany({
      include: {
        programs: true
      },
      orderBy: {
        name: 'asc'
      }
    });
    res.json(schools);
  } catch (error) {
    console.error('Error fetching schools:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get school by ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const school = await prisma.school.findUnique({
      where: { id },
      include: {
        programs: true
      }
    });

    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    res.json(school);
  } catch (error) {
    console.error('Error fetching school:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create school (admin only)
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, slug, overview } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ message: 'Name and slug are required' });
    }

    const school = await prisma.school.create({
      data: {
        name,
        slug,
        overview
      }
    });

    res.status(201).json(school);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Slug already exists' });
    }
    console.error('Error creating school:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update school (admin only)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, slug, overview } = req.body;

    const school = await prisma.school.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(overview !== undefined && { overview })
      }
    });

    res.json(school);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'School not found' });
    }
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Slug already exists' });
    }
    console.error('Error updating school:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete school (admin only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.school.delete({
      where: { id }
    });
    res.json({ message: 'School deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'School not found' });
    }
    console.error('Error deleting school:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;


