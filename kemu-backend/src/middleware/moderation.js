import { moderateContent, getModerationFallback } from '../utils/openaiClient.js';

/**
 * Moderation middleware
 * Checks user input for inappropriate content using OpenAI Moderation API
 */
export const moderateInput = async (req, res, next) => {
    try {
        const message = req.body.message;

        if (!message || typeof message !== 'string') {
            return next();
        }

        // Check content with OpenAI moderation
        const moderation = await moderateContent(message);

        if (moderation.flagged) {
            // Log moderation event
            console.warn('[MODERATION] Flagged content:', {
                ip: req.ip,
                sessionId: req.body.sessionId,
                categories: Object.keys(moderation.categories).filter(k => moderation.categories[k]),
                timestamp: new Date().toISOString(),
            });

            // Return safe fallback response
            return res.json({
                reply: getModerationFallback(),
                isModerated: true,
                tokensUsed: 0,
            });
        }

        // Content is safe, continue
        next();
    } catch (error) {
        console.error('[MODERATION] Error:', error.message);
        // On error, allow request to proceed (fail open)
        next();
    }
};

export default moderateInput;
