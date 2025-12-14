import prisma from './prisma.js';

/**
 * Knowledge Base Service
 * Fetches and formats database content for AI chatbot context
 */

/**
 * Fetch all schools with their programs
 */
async function getSchools() {
    try {
        const schools = await prisma.school.findMany({
            include: {
                programs: {
                    select: {
                        title: true,
                        degreeType: true,
                    }
                }
            },
            orderBy: {
                name: 'asc'
            }
        });
        return schools;
    } catch (error) {
        console.error('[KNOWLEDGE BASE] Error fetching schools:', error);
        return [];
    }
}

/**
 * Fetch all programs with school information
 */
async function getPrograms() {
    try {
        const programs = await prisma.program.findMany({
            include: {
                school: {
                    select: {
                        name: true,
                    }
                }
            },
            orderBy: {
                title: 'asc'
            }
        });
        return programs;
    } catch (error) {
        console.error('[KNOWLEDGE BASE] Error fetching programs:', error);
        return [];
    }
}

/**
 * Fetch recent news (last 10 items)
 */
async function getNews() {
    try {
        const news = await prisma.news.findMany({
            orderBy: {
                publishedAt: 'desc'
            },
            take: 10,
            select: {
                title: true,
                summary: true,
                publishedAt: true,
            }
        });
        return news;
    } catch (error) {
        console.error('[KNOWLEDGE BASE] Error fetching news:', error);
        return [];
    }
}

/**
 * Fetch upcoming events
 */
async function getEvents() {
    try {
        const events = await prisma.event.findMany({
            where: {
                date: {
                    gte: new Date()
                }
            },
            orderBy: {
                date: 'asc'
            },
            take: 10,
        });
        return events;
    } catch (error) {
        console.error('[KNOWLEDGE BASE] Error fetching events:', error);
        return [];
    }
}

/**
 * Format schools data for AI context
 */
function formatSchools(schools) {
    if (!schools.length) return '';

    let text = 'SCHOOLS:\n';
    schools.forEach((school, index) => {
        text += `${index + 1}. ${school.name}\n`;
        if (school.overview) {
            text += `   Overview: ${school.overview}\n`;
        }
        if (school.programs && school.programs.length > 0) {
            const programTitles = school.programs.map(p => p.title).join(', ');
            text += `   Programs: ${programTitles}\n`;
        }
        text += '\n';
    });
    return text;
}

/**
 * Format programs data for AI context
 */
function formatPrograms(programs) {
    if (!programs.length) return '';

    let text = 'PROGRAMS:\n';
    programs.forEach((program) => {
        text += `\n- ${program.title} (${program.degreeType}`;
        if (program.duration) text += `, ${program.duration}`;
        text += `)\n`;
        text += `  School: ${program.school.name}\n`;
        if (program.requirements) {
            text += `  Requirements: ${program.requirements}\n`;
        }
        if (program.overview) {
            // Truncate long overviews to save tokens
            const overview = program.overview.length > 200
                ? program.overview.substring(0, 200) + '...'
                : program.overview;
            text += `  Overview: ${overview}\n`;
        }
    });
    return text;
}

/**
 * Format news data for AI context
 */
function formatNews(newsItems) {
    if (!newsItems.length) return '';

    let text = 'RECENT NEWS:\n';
    newsItems.forEach((item) => {
        const date = new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        text += `- ${item.title} (${date})\n`;
        if (item.summary) {
            text += `  ${item.summary}\n`;
        }
    });
    return text;
}

/**
 * Format events data for AI context
 */
function formatEvents(events) {
    if (!events.length) return '';

    let text = 'UPCOMING EVENTS:\n';
    events.forEach((event) => {
        const date = new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        text += `- ${event.title} (${date})\n`;
        if (event.venue) {
            text += `  Venue: ${event.venue}\n`;
        }
        if (event.details) {
            text += `  Details: ${event.details}\n`;
        }
    });
    return text;
}

/**
 * Get full knowledge base (all data)
 */
export async function getFullKnowledgeBase() {
    try {
        const [schools, programs, news, events] = await Promise.all([
            getSchools(),
            getPrograms(),
            getNews(),
            getEvents()
        ]);

        const knowledgeBase = {
            schools: formatSchools(schools),
            programs: formatPrograms(programs),
            news: formatNews(news),
            events: formatEvents(events),
            raw: { schools, programs, news, events }
        };

        return knowledgeBase;
    } catch (error) {
        console.error('[KNOWLEDGE BASE] Error building knowledge base:', error);
        return {
            schools: '',
            programs: '',
            news: '',
            events: '',
            raw: { schools: [], programs: [], news: [], events: [] }
        };
    }
}

/**
 * Determine what context is relevant based on user message
 */
export function getRelevantSections(userMessage) {
    const msg = userMessage.toLowerCase();

    const sections = {
        schools: false,
        programs: false,
        news: false,
        events: false
    };

    // Check for programs/courses keywords
    if (msg.match(/program|course|degree|study|major|bsc|mba|master|bachelor|undergraduate|postgraduate/)) {
        sections.programs = true;
        sections.schools = true; // Include schools when asking about programs
    }

    // Check for school keywords
    if (msg.match(/school|faculty|department|computing|business|health|science/)) {
        sections.schools = true;
    }

    // Check for news keywords
    if (msg.match(/news|announcement|update|latest|recent|new/)) {
        sections.news = true;
    }

    // Check for events keywords
    if (msg.match(/event|calendar|graduation|registration|upcoming|when/)) {
        sections.events = true;
    }

    // Check for admissions keywords
    if (msg.match(/admission|apply|requirement|entry|qualify|enroll/)) {
        sections.programs = true;
    }

    // If no specific section matched, include programs and schools (most common queries)
    const hasMatch = Object.values(sections).some(v => v);
    if (!hasMatch) {
        sections.programs = true;
        sections.schools = true;
    }

    return sections;
}

/**
 * Build context string based on what sections are needed
 */
export async function getRelevantContext(userMessage) {
    const kb = await getFullKnowledgeBase();
    const sections = getRelevantSections(userMessage);

    let context = '';

    if (sections.schools && kb.schools) {
        context += kb.schools + '\n';
    }
    if (sections.programs && kb.programs) {
        context += kb.programs + '\n';
    }
    if (sections.news && kb.news) {
        context += kb.news + '\n';
    }
    if (sections.events && kb.events) {
        context += kb.events + '\n';
    }

    return context.trim();
}

/**
 * Build enhanced system prompt with knowledge base
 */
export async function buildEnhancedSystemPrompt(userMessage = '') {
    const context = await getRelevantContext(userMessage);

    const basePrompt = `You are "KeMU Assistant", a helpful AI assistant for Kenya Methodist University's website.

**Your role**:
- Greet warmly and professionally
- Provide accurate information about KeMU programs, admissions, news, and events
- Direct users to appropriate pages and resources
- Be concise but helpful (aim for 100-250 words unless detailed info is requested)

**Guidelines**:
- Use the knowledge base below to answer questions accurately
- For programs: Mention title, degree type, duration, requirements, and school
- For admissions: Reference specific program requirements from the knowledge base
- Link to /programs for program listings, /admissions for application info, /news for updates
- For information not in the knowledge base, direct users to contact the admissions office
- Never make up information - only use what's provided in the knowledge base

**Available pages**: /, /programs, /admissions, /news, /contact

---

KNOWLEDGE BASE (Current University Information):

${context}

---

Always be helpful, provide accurate information from the knowledge base, and guide users to official channels for formal matters.`;

    return basePrompt;
}

/**
 * Get knowledge base statistics
 */
export async function getKnowledgeBaseStats() {
    const kb = await getFullKnowledgeBase();

    const stats = {
        schools: kb.raw.schools.length,
        programs: kb.raw.programs.length,
        news: kb.raw.news.length,
        events: kb.raw.events.length,
        estimatedTokens: Math.ceil((kb.schools + kb.programs + kb.news + kb.events).length / 4),
        lastUpdated: new Date().toISOString()
    };

    return stats;
}

export default {
    getFullKnowledgeBase,
    getRelevantContext,
    buildEnhancedSystemPrompt,
    getKnowledgeBaseStats
};
