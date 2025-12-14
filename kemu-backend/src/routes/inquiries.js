import express from 'express';
import prisma from '../utils/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { sendInquiryNotification } from '../utils/email.js';

const router = express.Router();

// Create inquiry (public, no auth)
router.post('/', async (req, res) => {
  try {
    const { name, email, message, source } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        message,
        source: source || 'contact-form'
      }
    });

    // Send notification (stub for now)
    await sendInquiryNotification(inquiry);

    res.status(201).json(inquiry);
  } catch (error) {
    console.error('Error creating inquiry:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all inquiries (admin only)
router.get('/', authenticate, async (req, res) => {
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(inquiries);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get single inquiry (admin only)
router.get('/:id', authenticate, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const inquiry = await prisma.inquiry.findUnique({
      where: { id }
    });

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    res.json(inquiry);
  } catch (error) {
    console.error('Error fetching inquiry:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Toggle inquiry read status (admin only)
router.put('/:id/mark-read', authenticate, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // First get current status
    const current = await prisma.inquiry.findUnique({
      where: { id }
    });

    if (!current) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    // Toggle the isRead status
    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: { isRead: !current.isRead }
    });

    res.json(inquiry);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    console.error('Error updating inquiry:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete inquiry (admin only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.inquiry.delete({
      where: { id }
    });
    res.json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    console.error('Error deleting inquiry:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;


