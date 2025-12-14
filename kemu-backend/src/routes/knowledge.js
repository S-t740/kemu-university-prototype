import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
    getFullKnowledgeBase,
    buildEnhancedSystemPrompt,
    getKnowledgeBaseStats
} from '../utils/knowledgeBase.js';

const router = express.Router();

// GET /api/knowledge/preview - View current knowledge base content (admin only)
router.get('/preview', authenticate, async (req, res) => {
    try {
        const kb = await getFullKnowledgeBase();

        res.json({
            schools: kb.schools,
            programs: kb.programs,
            news: kb.news,
            events: kb.events,
            raw: kb.raw
        });
    } catch (error) {
        console.error('[KNOWLEDGE PREVIEW] Error:', error);
        res.status(500).json({ error: 'Failed to fetch knowledge base' });
    }
});

// GET /api/knowledge/stats - Get knowledge base statistics (admin only)
router.get('/stats', authenticate, async (req, res) => {
    try {
        const stats = await getKnowledgeBaseStats();
        res.json(stats);
    } catch (error) {
        console.error('[KNOWLEDGE STATS] Error:', error);
        res.status(500).json({ error: 'Failed to fetch knowledge base stats' });
    }
});

// POST /api/knowledge/test - Test chatbot with sample question (admin only)
router.post('/test', authenticate, async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Build the system prompt for this message
        const systemPrompt = await buildEnhancedSystemPrompt(message);

        res.json({
            message,
            systemPrompt,
            promptLength: systemPrompt.length,
            estimatedTokens: Math.ceil(systemPrompt.length / 4)
        });
    } catch (error) {
        console.error('[KNOWLEDGE TEST] Error:', error);
        res.status(500).json({ error: 'Failed to test knowledge base' });
    }
});

export default router;
