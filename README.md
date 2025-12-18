<div align="center">
<img width="1200" height="475" alt="KeMU Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# 🎓 KeMU University Prototype

**A modern, full-stack web application prototype for Kenya Methodist University**

[![React](https://img.shields.io/badge/React-19.2-61dafb?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.18-000000?logo=express)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.7-2d3748?logo=prisma)](https://www.prisma.io/)

</div>

---

## 📖 Overview

This is a comprehensive university website prototype built with modern web technologies. It features a beautiful glassmorphism design, AI-powered chatbot, complete admin panel for content management, and a robust backend API.

## ✨ Features

### 🎨 Frontend
- **Modern Design System** - Glassmorphism effects, 3D shadows, and smooth animations
- **Responsive Layout** - Mobile-first design that works on all devices
- **Dynamic Content** - All content fetched from backend API
- **AI Chatbot** - Powered by Google Gemini for intelligent responses
- **Rich Pages** - Home, About, Programs, Schools, News, Events, Admissions, Careers, Portals

### 🔧 Backend
- **RESTful API** - 13 comprehensive API endpoints
- **Authentication** - JWT-based admin authentication
- **File Uploads** - Support for images and documents
- **AI Integration** - Google Gemini AI for chatbot functionality
- **Rate Limiting** - Protection against API abuse
- **Content Moderation** - AI-powered content moderation

### 🛠 Admin Panel
- **Content Management** - Schools, Programs, News, Events
- **Vacancy Management** - Post jobs and review applications
- **Student Services** - Manage student service information
- **Directorates** - Manage university directorates
- **Inbox** - View and respond to inquiries
- **AI Conversations** - Monitor chatbot interactions

---

## 🏗 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 19.2 | UI Framework |
| TypeScript 5.8 | Type Safety |
| Vite 6.2 | Build Tool |
| React Router 7 | Routing |
| Axios | HTTP Client |
| Lucide React | Icons |
| Tailwind CSS | Styling |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express 4.18 | Web Framework |
| Prisma 5.7 | ORM |
| SQLite | Database |
| JWT | Authentication |
| Multer | File Uploads |
| Google Generative AI | Chatbot |

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ installed
- npm or yarn package manager

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/your-username/kemu-university-prototype.git
cd kemu-university-prototype

# Install frontend dependencies
npm install

# Install backend dependencies
cd kemu-backend
npm install
```

### 2. Environment Setup

Create `.env` in `kemu-backend/`:
```env
PORT=4000
CORS_ORIGIN=http://localhost:3001
JWT_SECRET=your-secret-key-here
GEMINI_API_KEY=your-gemini-api-key
```

Create `.env.local` in root:
```env
GEMINI_API_KEY=your-gemini-api-key
```

### 3. Database Setup

```bash
cd kemu-backend
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed  # Optional: seed sample data
```

### 4. Run Development Servers

**Terminal 1 - Backend:**
```bash
cd kemu-backend
npm run dev
# API running at http://localhost:4000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
# App running at http://localhost:3001
```

---

## 📁 Project Structure

```
kemu-university-prototype/
├── 📂 components/           # React components
│   ├── 📂 admin/           # Admin-specific components
│   ├── 📂 common/          # Reusable UI components
│   ├── 📂 home/            # Homepage sections
│   └── 📂 students/        # Student-related components
├── 📂 pages/               # Page components (routes)
├── 📂 services/            # API service functions
├── 📂 hooks/               # Custom React hooks
├── 📂 utils/               # Utility functions
├── 📂 widgets/             # Standalone widgets (Chatbot)
├── 📂 public/              # Static assets
├── 📂 kemu-backend/        # Backend API
│   ├── 📂 prisma/          # Database schema & migrations
│   ├── 📂 src/
│   │   ├── 📂 routes/      # API route handlers
│   │   ├── 📂 middleware/  # Express middleware
│   │   └── 📂 utils/       # Backend utilities
│   └── 📂 uploads/         # Uploaded files
├── 📄 App.tsx              # Main app component
├── 📄 types.ts             # TypeScript types
├── 📄 constants.ts         # App constants
├── 📄 tailwind.config.js   # Tailwind configuration
└── 📄 DESIGN_SYSTEM.md     # Design system docs
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [API Documentation](docs/API_DOCS.md) | Complete API reference |
| [Database Schema](docs/DATABASE.md) | Database models and relationships |
| [Admin Guide](docs/ADMIN_GUIDE.md) | Admin panel user guide |
| [Developer Guide](docs/DEVELOPER_GUIDE.md) | Development setup and guidelines |
| [Design System](DESIGN_SYSTEM.md) | Component library and styling |

---

## 🔑 Default Admin Credentials

After seeding the database:
- **Email:** `admin@kemu.ac.ke`
- **Password:** `admin123`

---

## 📜 Available Scripts

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run fetch-content # Fetch content from external source
```

### Backend
```bash
npm run dev              # Start with nodemon (hot reload)
npm start                # Start production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:seed      # Seed database with sample data
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is developed for Kenya Methodist University.

---

<div align="center">
Made with ❤️ for Kenya Methodist University
</div>
