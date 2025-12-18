import OpenAI from 'openai';
import dotenv from 'dotenv';
import { buildEnhancedSystemPrompt } from './knowledgeBase.js';

dotenv.config();

// Lazy initialization - don't crash if API key is missing at startup
let openai = null;

const getOpenAIClient = () => {
    if (!openai) {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OpenAI API key not configured. Chatbot is unavailable.');
        }
        openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
    return openai;
};

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const MAX_TOKENS = parseInt(process.env.OPENAI_MAX_TOKENS) || 500;

/**
 * Call OpenAI Chat Completions API with knowledge base context
 * @param {Array} messages - Array of message objects {role, content}
 * @param {Object} options - Optional overrides (temperature, maxTokens, systemPrompt, etc.)
 * @returns {Promise} - Response from OpenAI
 */
export const getChatCompletion = async (messages, options = {}) => {
    try {
        // Get system prompt (use custom or build from knowledge base)
        let systemPrompt;
        if (options.systemPrompt) {
            systemPrompt = options.systemPrompt;
        } else {
            // Get the user's first message to determine relevant context
            const userMessage = messages.find(m => m.role === 'user')?.content || '';
            systemPrompt = await buildEnhancedSystemPrompt(userMessage);
        }

        // Prepend system prompt if not already present
        const hasSystemPrompt = messages.some(m => m.role === 'system');
        const fullMessages = hasSystemPrompt
            ? messages
            : [{ role: 'system', content: systemPrompt }, ...messages];

        const response = await getOpenAIClient().chat.completions.create({
            model: MODEL,
            messages: fullMessages,
            max_tokens: options.maxTokens || MAX_TOKENS,
            temperature: options.temperature || 0.7,
            ...options,
        });

        return {
            content: response.choices[0].message.content,
            tokensUsed: response.usage?.total_tokens || 0,
            promptTokens: response.usage?.prompt_tokens || 0,
            completionTokens: response.usage?.completion_tokens || 0,
        };
    } catch (error) {
        console.error('OpenAI API Error:', error.message);

        // Handle specific error types
        if (error.status === 429) {
            throw new Error('Rate limit exceeded. Please try again in a moment.');
        } else if (error.status === 401) {
            throw new Error('OpenAI API authentication failed. Please check configuration.');
        } else if (error.status === 400) {
            throw new Error('Invalid request to OpenAI. Please try rephrasing your message.');
        }

        throw new Error('AI service temporarily unavailable. Please try again later.');
    }
};

/**
 * Check content with OpenAI Moderation API
 * @param {string} content - Content to moderate
 * @returns {Promise<Object>} - Moderation result {flagged: boolean, categories: {}}
 */
export const moderateContent = async (content) => {
    try {
        const moderation = await getOpenAIClient().moderations.create({
            input: content,
        });

        const result = moderation.results[0];

        return {
            flagged: result.flagged,
            categories: result.categories,
            categoryScores: result.category_scores,
        };
    } catch (error) {
        console.error('Moderation API Error:', error.message);
        // If moderation fails, err on the side of caution
        return {
            flagged: false,
            categories: {},
            error: error.message,
        };
    }
};

/**
 * Get fallback response for moderated content
 * @returns {string} - Safe fallback message
 */
export const getModerationFallback = () => {
    return "I'm sorry, but I can't assist with that request. If you have questions about Kenya Methodist University, please visit our Contact page at /contact or reach out to our admissions office directly.";
};

export default { getChatCompletion, moderateContent, getModerationFallback };
