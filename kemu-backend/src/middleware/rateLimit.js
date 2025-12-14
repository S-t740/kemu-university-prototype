// Simple in-memory rate limiter
// For production, consider using Redis or a more robust solution

const rateLimitStore = new Map();

/**
 * Rate limiting middleware
 * Limits requests per IP/session within a time window
 */
export const rateLimitChat = (req, res, next) => {
    const identifier = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const limit = parseInt(process.env.CHAT_RATE_LIMIT) || 10;
    const window = parseInt(process.env.CHAT_RATE_WINDOW) || 60; // seconds

    const now = Date.now();
    const key = `chat:${identifier}`;

    if (!rateLimitStore.has(key)) {
        rateLimitStore.set(key, { count: 1, resetAt: now + (window * 1000) });
        return next();
    }

    const record = rateLimitStore.get(key);

    // Reset if window expired
    if (now > record.resetAt) {
        record.count = 1;
        record.resetAt = now + (window * 1000);
        return next();
    }

    // Check if limit exceeded
    if (record.count >= limit) {
        const secondsRemaining = Math.ceil((record.resetAt - now) / 1000);
        return res.status(429).json({
            error: 'Rate limit exceeded',
            message: `Too many messages. Please wait ${secondsRemaining} seconds before trying again.`,
            retryAfter: secondsRemaining,
        });
    }

    // Increment counter
    record.count += 1;
    next();
};

// Cleanup old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
        if (now > record.resetAt + 60000) { // 1 minute grace period
            rateLimitStore.delete(key);
        }
    }
}, 5 * 60 * 1000);

export default rateLimitChat;
