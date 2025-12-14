import api from './api';

interface ChatSession {
    sessionId: string;
    conversationId: number;
}

interface ChatMessage {
    reply: string;
    conversationId: number;
    tokensUsed: number;
    isModerated?: boolean;
    fallback?: boolean;
}

interface Conversation {
    id: number;
    sessionId: string;
    userName?: string;
    userEmail?: string;
    isLogged: boolean;
    resolved: boolean;
    messageCount: number;
    lastMessage: string;
    createdAt: string;
    updatedAt: string;
}

interface Message {
    id: number;
    conversationId: number;
    role: string;
    content: string;
    tokenCount?: number;
    createdAt: string;
}

interface ConversationDetail {
    id: number;
    sessionId: string;
    userName?: string;
    userEmail?: string;
    isLogged: boolean;
    resolved: boolean;
    messages: Message[];
    createdAt: string;
    updatedAt: string;
}

/**
 * Create a new chat session
 */
export const createChatSession = async (
    userName?: string,
    userEmail?: string,
    isLogged: boolean = true
): Promise<ChatSession> => {
    const response = await api.post('/chat/session', {
        userName,
        userEmail,
        isLogged,
    });
    return response.data;
};

/**
 * Send a message and get AI reply
 */
export const sendChatMessage = async (
    sessionId: string,
    message: string,
    isLogged: boolean = true,
    userName?: string,
    userEmail?: string
): Promise<ChatMessage> => {
    const response = await api.post('/chat/message', {
        sessionId,
        message,
        isLogged,
        userName,
        userEmail,
    });
    return response.data;
};

/**
 * Get all conversations (admin only)
 */
export const getChatConversations = async (
    limit: number = 50,
    offset: number = 0
): Promise<Conversation[]> => {
    const response = await api.get('/chat/conversations', {
        params: { limit, offset },
    });
    return response.data;
};

/**
 * Get single conversation with all messages (admin only)
 */
export const getChatConversation = async (id: number): Promise<ConversationDetail> => {
    const response = await api.get(`/chat/conversation/${id}`);
    return response.data;
};

/**
 * Toggle conversation resolved status (admin only)
 */
export const toggleConversationResolved = async (id: number): Promise<ConversationDetail> => {
    const response = await api.put(`/chat/conversation/${id}/resolve`);
    return response.data;
};

/**
 * Delete conversation (admin only)
 */
export const deleteChatConversation = async (id: number): Promise<void> => {
    await api.delete(`/chat/conversation/${id}`);
};

/**
 * Submit feedback for a message
 */
export const submitChatFeedback = async (
    messageId: number,
    rating: 'up' | 'down',
    comment?: string
): Promise<void> => {
    await api.post('/chat/feedback', {
        messageId,
        rating,
        comment,
    });
};

/**
 * Get token usage statistics (admin only)
 */
export const getChatUsage = async (): Promise<{
    totalTokens: number;
    totalMessages: number;
    byDay: Record<string, number>;
}> => {
    const response = await api.get('/chat/usage');
    return response.data;
};

export type {
    ChatSession,
    ChatMessage,
    Conversation,
    Message,
    ConversationDetail,
};
