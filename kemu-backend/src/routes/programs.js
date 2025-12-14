import express from 'express';
import prisma from '../utils/prisma.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all programs with filters
router.get('/', async (req, res) => {
  try {
    const { q, degree, schoolId } = req.query;

    const where = {};

    if (q) {
      where.title = {
        contains: q,
        mode: 'insensitive'
      };
    }

    if (degree) {
      where.degreeType = degree;
    }

    if (schoolId) {
      where.schoolId = parseInt(schoolId);
    }

    const programs = await prisma.program.findMany({
      where,
      include: {
        school: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(programs);
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get program by slug
router.get('/:slug', async (req, res) => {
  try {
    const program = await prisma.program.findUnique({
      where: { slug: req.params.slug },
      include: {
        school: true
      }
    });

    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    res.json(program);
  } catch (error) {
    console.error('Error fetching program:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create program (admin only)
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, slug, degreeType, duration, overview, requirements, schoolId } = req.body;

    if (!title || !slug || !degreeType || !schoolId) {
      return res.status(400).json({ message: 'Title, slug, degreeType, and schoolId are required' });
    }

    const program = await prisma.program.create({
      data: {
        title,
        slug,
        degreeType,
        duration,
        overview,
        requirements,
        schoolId: parseInt(schoolId)
      },
      include: {
        school: true
      }
    });

    res.status(201).json(program);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Slug already exists' });
    }
    console.error('Error creating program:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update program (admin only)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, slug, degreeType, duration, overview, requirements, schoolId } = req.body;

    const program = await prisma.program.update({
      where: { id },
      data: {
        title,
        slug,
        degreeType,
        duration,
        overview,
        requirements,
        schoolId: schoolId ? parseInt(schoolId) : undefined
      },
      include: {
        school: true
      }
    });

    res.json(program);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Program not found' });
    }
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Slug already exists' });
    }
    console.error('Error updating program:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete program (admin only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.program.delete({
      where: { id }
    });
    res.json({ message: 'Program deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Program not found' });
    }
    console.error('Error deleting program:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;


