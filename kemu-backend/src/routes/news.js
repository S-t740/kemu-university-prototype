import express from 'express';
import prisma from '../utils/prisma.js';
import { authenticate } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Get all news
router.get('/', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;

    const news = await prisma.news.findMany({
      take: limit,
      orderBy: {
        publishedAt: 'desc'
      }
    });

    // Parse images JSON for each news item
    const newsWithImages = news.map(item => ({
      ...item,
      images: item.images ? JSON.parse(item.images) : []
    }));

    res.json(newsWithImages);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get news by slug
router.get('/:slug', async (req, res) => {
  try {
    const news = await prisma.news.findUnique({
      where: { slug: req.params.slug }
    });

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    // Parse images JSON
    const newsWithImages = {
      ...news,
      images: news.images ? JSON.parse(news.images) : []
    };

    res.json(newsWithImages);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create news (admin only)
router.post('/', authenticate, upload.array('images', 5), async (req, res) => {
  try {
    const { title, slug, summary, content, publishedAt } = req.body;

    if (!title || !slug || !content) {
      return res.status(400).json({ message: 'Title, slug, and content are required' });
    }

    // Get uploaded file paths
    const imageUrls = req.files ? req.files.map(file => `/uploads/news/${file.filename}`) : [];

    const news = await prisma.news.create({
      data: {
        title,
        slug,
        summary,
        content,
        images: imageUrls.length > 0 ? JSON.stringify(imageUrls) : null,
        author: req.body.author,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date()
      }
    });

    // Parse images for response
    const newsWithImages = {
      ...news,
      images: news.images ? JSON.parse(news.images) : []
    };

    res.status(201).json(newsWithImages);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Slug already exists' });
    }
    console.error('Error creating news:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update news (admin only)
router.put('/:id', authenticate, upload.array('images', 5), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, slug, summary, content, publishedAt, existingImages } = req.body;

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
    const newImageUrls = req.files ? req.files.map(file => `/uploads/news/${file.filename}`) : [];
    const allImages = [...currentImages, ...newImageUrls];

    const news = await prisma.news.update({
      where: { id },
      data: {
        title,
        slug,
        summary,
        content,
        images: allImages.length > 0 ? JSON.stringify(allImages) : null,
        author: req.body.author,
        publishedAt: publishedAt ? new Date(publishedAt) : undefined
      }
    });

    // Parse images for response
    const newsWithImages = {
      ...news,
      images: news.images ? JSON.parse(news.images) : []
    };

    res.json(newsWithImages);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'News not found' });
    }
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Slug already exists' });
    }
    console.error('Error updating news:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete news (admin only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.news.delete({
      where: { id }
    });
    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'News not found' });
    }
    console.error('Error deleting news:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;


