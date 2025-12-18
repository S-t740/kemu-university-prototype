import express from 'express';
import prisma from '../utils/prisma.js';
import { authenticate } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Get all events (upcoming by default)
router.get('/', async (req, res) => {
  try {
    const now = new Date();
    const { institution, excludeInstitution } = req.query;

    const where = {
      date: {
        gte: now
      }
    };

    if (institution) {
      where.institution = institution;
    }

    // Exclude events from a specific institution
    if (excludeInstitution) {
      where.NOT = {
        institution: excludeInstitution
      };
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: {
        date: 'asc'
      }
    });

    // Parse images JSON for each event
    const eventsWithImages = events.map(item => ({
      ...item,
      images: item.images ? JSON.parse(item.images) : []
    }));

    res.json(eventsWithImages);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const event = await prisma.event.findUnique({
      where: { id }
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Parse images JSON
    const eventWithImages = {
      ...event,
      images: event.images ? JSON.parse(event.images) : []
    };

    res.json(eventWithImages);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create event (admin only)
router.post('/', authenticate, upload.array('images', 5), async (req, res) => {
  try {
    const { title, date, venue, details, institution } = req.body;

    if (!title || !date || !venue) {
      return res.status(400).json({ message: 'Title, date, and venue are required' });
    }

    // Get uploaded file paths
    const imageUrls = req.files ? req.files.map(file => `/uploads/events/${file.filename}`) : [];

    const event = await prisma.event.create({
      data: {
        title,
        date: new Date(date),
        venue,
        details,
        images: imageUrls.length > 0 ? JSON.stringify(imageUrls) : null,
        institution: institution || 'University'
      }
    });

    // Parse images for response
    const eventWithImages = {
      ...event,
      images: event.images ? JSON.parse(event.images) : []
    };

    res.status(201).json(eventWithImages);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update event (admin only)
router.put('/:id', authenticate, upload.array('images', 5), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, date, venue, details, existingImages } = req.body;

    // Parse existing images from request
    let currentImages = [];
    if (existingImages) {
      try {
        currentImages = JSON.parse(existingImages);
      } catch (e) {
        currentImages = [];
      }
    }

    // Add new uploaded file paths
    const newImageUrls = req.files ? req.files.map(file => `/uploads/events/${file.filename}`) : [];
    const allImages = [...currentImages, ...newImageUrls];

    const event = await prisma.event.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(date && { date: new Date(date) }),
        ...(venue && { venue }),
        ...(details !== undefined && { details }),
        images: allImages.length > 0 ? JSON.stringify(allImages) : null
      }
    });

    // Parse images for response
    const eventWithImages = {
      ...event,
      images: event.images ? JSON.parse(event.images) : []
    };

    res.json(eventWithImages);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Event not found' });
    }
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete event (admin only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.event.delete({
      where: { id }
    });
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Event not found' });
    }
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;


