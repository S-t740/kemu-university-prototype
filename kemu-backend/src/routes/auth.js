import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma.js';

const router = express.Router();

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const loginIdentifier = email || username;

    if (!loginIdentifier || !password) {
      return res.status(400).json({ message: 'Email/username and password are required' });
    }

    const admin = await prisma.admin.findUnique({
      where: { email: loginIdentifier }
    });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Return demo token for prototype (or JWT for production)
    const token = process.env.NODE_ENV === 'production'
      ? jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, process.env.JWT_SECRET || 'kemu-secret-key', { expiresIn: '24h' })
      : 'demo-token';

    res.json({
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin register (dev only)
router.post('/admin/register', async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ message: 'Registration disabled in production' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        role: 'admin'
      }
    });

    res.status(201).json({
      id: admin.id,
      email: admin.email,
      role: admin.role
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    console.error('Register error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;


