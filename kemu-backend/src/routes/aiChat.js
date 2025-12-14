import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../utils/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { rateLimitChat } from '../middleware/rateLimit.js';
import { moderateInput } from '../middleware/moderation.js';
import { getChatCompletion } from '../utils/openaiClient.js';

const router = express.Router();

// POST /api/chat/session - Create or get chat session
router.post('/session', async (req, res) => {
    try {
        const { userName, userEmail, isLogged = true } = req.body;

        const sessionId = uuidv4();

        const conversation = await prisma.conversation.create({
            data: {
                sessionId,
                userName,
                userEmail,
                isLogged,
                source: 'chatbot_ai',
            },
        });

        res.json({
            sessionId: conversation.sessionId,
            conversationId: conversation.id,
        });
    } catch (error) {
        console.error('[CHAT SESSION] Error:', error);
        res.status(500).json({ error: 'Failed to create session' });
    }
});

// POST /api/chat/message - Send message and get AI reply
router.post('/message', rateLimitChat, moderateInput, async (req, res) => {
    try {
        const { sessionId, message, userName, userEmail, isLogged = true } = req.body;

        // Validation
        if (!sessionId || !message) {
            return res.status(400).json({ error: 'sessionId and message are required' });
        }

        if (message.length > 2000) {
            return res.status(400).json({ error: 'Message too long (max 2000 characters)' });
        }

        // Find or create conversation
        let conversation = await prisma.conversation.findUnique({
            where: { sessionId },
            include: { messages: { orderBy: { createdAt: 'desc' }, take: 10 } },
        });

        if (!conversation) {
            // Create new conversation if not found
            conversation = await prisma.conversation.create({
                data: {
                    sessionId,
                    userName,
                    userEmail,
                    isLogged,
                    source: 'chatbot_ai',
                },
                include: { messages: true },
            });
        }

        // Build conversation history for context (last 10 messages)
        const historyMessages = conversation.messages
            .reverse()
            .map(m => ({
                role: m.role,
                content: m.content,
            }));

        // Add current user message
        const userMessage = { role: 'user', content: message };
        const allMessages = [...historyMessages, userMessage];

        // Call OpenAI
        const aiResponse = await getChatCompletion(allMessages);

        // Store messages if logging is enabled
        if (conversation.isLogged) {
            // Store user message
            await prisma.message.create({
                data: {
                    conversationId: conversation.id,
                    role: 'user',
                    content: message,
                    tokenCount: aiResponse.promptTokens,
                },
            });

            // Store assistant message
            await prisma.message.create({
                data: {
                    conversationId: conversation.id,
                    role: 'assistant',
                    content: aiResponse.content,
                    tokenCount: aiResponse.completionTokens,
                },
            });
        }

        res.json({
            reply: aiResponse.content,
            conversationId: conversation.id,
            tokensUsed: aiResponse.tokensUsed,
        });
    } catch (error) {
        console.error('[CHAT MESSAGE] Error:', error);

        // Return user-friendly error
        res.status(500).json({
            error: 'AI service error',
            message: error.message || 'Failed to get response. Please try again.',
            fallback: true, // Signal that frontend should offer inquiry form
        });
    }
});

// GET /api/chat/conversations - List conversations (admin only)
router.get('/conversations', authenticate, async (req, res) => {
    try {
        const { limit = 50, offset = 0 } = req.query;

        const conversations = await prisma.conversation.findMany({
            take: parseInt(limit),
            skip: parseInt(offset),
            orderBy: { updatedAt: 'desc' },
            include: {
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1, // Get last message for snippet
                },
                _count: {
                    select: { messages: true },
                },
            },
        });

        const formatted = conversations.map(conv => ({
            id: conv.id,
            sessionId: conv.sessionId,
            userName: conv.userName,
            userEmail: conv.userEmail,
            isLogged: conv.isLogged,
            resolved: conv.resolved,
            messageCount: conv._count.messages,
            lastMessage: conv.messages[0]?.content.substring(0, 100) || '',
            createdAt: conv.createdAt,
            updatedAt: conv.updatedAt,
        }));

        res.json(formatted);
    } catch (error) {
        console.error('[CHAT CONVERSATIONS] Error:', error);
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }
});

// GET /api/chat/conversation/:id - Get single conversation with all messages (admin only)
router.get('/conversation/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;

        const conversation = await prisma.conversation.findUnique({
            where: { id: parseInt(id) },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                },
            },
        });

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        res.json(conversation);
    } catch (error) {
        console.error('[CHAT CONVERSATION] Error:', error);
        res.status(500).json({ error: 'Failed to fetch conversation' });
    }
});

// PUT /api/chat/conversation/:id/resolve - Mark conversation as resolved (admin only)
router.put('/conversation/:id/resolve', authenticate, async (req, res) => {
    try {
        const { id } = req.params;

        const conversation = await prisma.conversation.findUnique({
            where: { id: parseInt(id) },
        });

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        const updated = await prisma.conversation.update({
            where: { id: parseInt(id) },
            data: { resolved: !conversation.resolved },
        });

        res.json(updated);
    } catch (error) {
        console.error('[CHAT RESOLVE] Error:', error);
        res.status(500).json({ error: 'Failed to update conversation' });
    }
});

// DELETE /api/chat/conversation/:id - Delete conversation (admin only)
router.delete('/conversation/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.conversation.delete({
            where: { id: parseInt(id) },
        });

        res.json({ message: 'Conversation deleted successfully' });
    } catch (error) {
        console.error('[CHAT DELETE] Error:', error);
        res.status(500).json({ error: 'Failed to delete conversation' });
    }
});

// POST /api/chat/feedback - Submit feedback (optional feature)
router.post('/feedback', async (req, res) => {
    try {
        const { messageId, rating, comment } = req.body;

        // For now, just log feedback
        // In production, you might store this in a separate Feedback table
        console.log('[CHAT FEEDBACK]', { messageId, rating, comment });

        res.json({ message: 'Feedback received' });
    } catch (error) {
        console.error('[CHAT FEEDBACK] Error:', error);
        res.status(500).json({ error: 'Failed to submit feedback' });
    }
});

// GET /api/chat/usage - Get token usage statistics (admin only)
router.get('/usage', authenticate, async (req, res) => {
    try {
        const messages = await prisma.message.findMany({
            where: {
                tokenCount: { not: null },
            },
            select: {
                tokenCount: true,
                createdAt: true,
            },
        });

        const totalTokens = messages.reduce((sum, m) => sum + (m.tokenCount || 0), 0);

        // Group by day
        const byDay = {};
        messages.forEach(m => {
            const day = m.createdAt.toISOString().split('T')[0];
            byDay[day] = (byDay[day] || 0) + (m.tokenCount || 0);
        });

        res.json({
            totalTokens,
            totalMessages: messages.length,
            byDay,
        });
    } catch (error) {
        console.error('[CHAT USAGE] Error:', error);
        res.status(500).json({ error: 'Failed to fetch usage stats' });
    }
});

export default router;
