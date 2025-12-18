import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

// Import routes
import authRoutes from './routes/auth.js';
import schoolsRoutes from './routes/schools.js';
import programsRoutes from './routes/programs.js';
import newsRoutes from './routes/news.js';
import eventsRoutes from './routes/events.js';
import vacanciesRoutes from './routes/vacancies.js';
import applicationsRoutes from './routes/applications.js';
import inquiriesRoutes from './routes/inquiries.js';
import statsRoutes from './routes/stats.js';
import aiChatRoutes from './routes/aiChat.js';
import knowledgeRoutes from './routes/knowledge.js';
import studentServicesRoutes from './routes/studentServices.js';
import directoratesRoutes from './routes/directorates.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// Middleware
app.use(cors({
  origin: [CORS_ORIGIN, 'http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3001'],
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'KeMU API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/schools', schoolsRoutes);
app.use('/api/programs', programsRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/vacancies', vacanciesRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/inquiries', inquiriesRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/chat', aiChatRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/student-services', studentServicesRoutes);
app.use('/api/directorates', directoratesRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 KeMU API server running on http://localhost:${PORT}`);
  console.log(`📡 CORS enabled for: ${CORS_ORIGIN}`);
});

export default app;


