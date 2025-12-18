# 👨‍💻 Developer Guide

A comprehensive guide for developers working on the KeMU University Prototype.

---

## 📋 Prerequisites

Before starting, ensure you have:

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **npm** v9+ (comes with Node.js)
- **Git** for version control
- **VS Code** (recommended) with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - Prisma

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/kemu-university-prototype.git
cd kemu-university-prototype
```

### 2. Install Dependencies

```bash
# Frontend dependencies
npm install

# Backend dependencies
cd kemu-backend
npm install
cd ..
```

### 3. Environment Setup

**Frontend** (`.env.local` in root):
```env
GEMINI_API_KEY=your-gemini-api-key
```

**Backend** (`kemu-backend/.env`):
```env
PORT=4000
CORS_ORIGIN=http://localhost:3001
JWT_SECRET=your-secure-secret-key
GEMINI_API_KEY=your-gemini-api-key
```

### 4. Database Setup

```bash
cd kemu-backend

# Generate Prisma client
npm run prisma:generate

# Create database and run migrations
npm run prisma:migrate

# Seed with sample data (optional)
npm run prisma:seed
```

### 5. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd kemu-backend
npm run dev
# Running at http://localhost:4000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
# Running at http://localhost:3001
```

---

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                     │
│  ┌─────────┬─────────┬─────────┬─────────┬──────────┐  │
│  │  Pages  │Components│ Services│  Hooks  │  Utils   │  │
│  └────┬────┴────┬────┴────┬────┴────┬────┴────┬─────┘  │
│       │         │         │         │         │         │
│       └─────────┴────┬────┴─────────┴─────────┘         │
│                      │                                   │
│                      ▼                                   │
│              API Layer (Axios)                          │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/JSON
┌──────────────────────▼──────────────────────────────────┐
│                   Backend (Express)                      │
│  ┌──────────┬────────────┬──────────┬────────────────┐  │
│  │  Routes  │ Middleware │  Utils   │  Prisma Client │  │
│  └────┬─────┴─────┬──────┴────┬─────┴───────┬────────┘  │
│       │           │           │             │            │
│       └───────────┴─────┬─────┴─────────────┘            │
│                         │                                 │
│                         ▼                                 │
│                   SQLite Database                         │
└───────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

### Frontend

```
├── App.tsx                 # Root component with routing
├── index.tsx               # Entry point
├── types.ts                # TypeScript interfaces
├── constants.ts            # App constants
├── globals.css             # Global styles
│
├── components/
│   ├── index.ts            # Barrel exports
│   ├── Navbar.tsx          # Main navigation
│   ├── Footer.tsx          # Site footer
│   ├── admin/              # Admin-specific components
│   ├── common/             # Reusable UI components
│   │   ├── PageHero.tsx
│   │   ├── TabSection.tsx
│   │   └── ...
│   ├── home/               # Homepage sections
│   │   ├── Hero.tsx
│   │   ├── SchoolsShowcase.tsx
│   │   ├── NewsAndEvents.tsx
│   │   └── ...
│   └── students/           # Student page components
│
├── pages/
│   ├── Home.tsx
│   ├── About.tsx
│   ├── Admin.tsx           # Admin panel (100KB+)
│   ├── Programs.tsx
│   └── ...
│
├── services/
│   ├── api.ts              # Main API functions
│   └── chatApi.ts          # Chatbot API
│
├── hooks/
│   └── useScrollEffect.ts
│
├── utils/
│   ├── formatDate.ts
│   └── ...
│
└── widgets/
    └── Chatbot.tsx         # AI chatbot widget
```

### Backend

```
kemu-backend/
├── src/
│   ├── server.js           # Express app setup
│   ├── routes/
│   │   ├── auth.js         # Authentication
│   │   ├── schools.js      # Schools CRUD
│   │   ├── programs.js     # Programs CRUD
│   │   ├── news.js         # News CRUD
│   │   ├── events.js       # Events CRUD
│   │   ├── vacancies.js    # Vacancies CRUD
│   │   ├── applications.js # Applications CRUD
│   │   ├── inquiries.js    # Inquiries CRUD
│   │   ├── stats.js        # Site statistics
│   │   ├── aiChat.js       # AI chatbot
│   │   ├── knowledge.js    # Knowledge base
│   │   ├── studentServices.js
│   │   └── directorates.js
│   │
│   ├── middleware/
│   │   ├── auth.js         # JWT authentication
│   │   ├── rateLimit.js    # Rate limiting
│   │   ├── moderation.js   # Content moderation
│   │   └── upload.js       # File uploads (Multer)
│   │
│   └── utils/
│       └── ...
│
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── seed.js             # Database seeder
│   └── dev.db              # SQLite database
│
└── uploads/                # Uploaded files
```

---

## 🎨 Component Guidelines

### Creating New Components

1. **Location:** Place in appropriate subdirectory
2. **Naming:** Use PascalCase (`MyComponent.tsx`)
3. **TypeScript:** Define prop interfaces

```tsx
// components/common/MyComponent.tsx
import React from 'react';

interface MyComponentProps {
  title: string;
  children?: React.ReactNode;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, children }) => {
  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-bold text-kemu-purple">{title}</h2>
      {children}
    </div>
  );
};

export default MyComponent;
```

### Using Design System

Import utility classes from `DESIGN_SYSTEM.md`:

```tsx
// Glass effect
<div className="glass-card">...</div>

// Gold button
<button className="gold-btn">Apply Now</button>

// Brand colors
<span className="text-kemu-purple">KeMU Colors</span>
<span className="text-kemu-gold">Gold Accent</span>
```

---

## 🔌 Adding New API Endpoints

### 1. Create Route File

```javascript
// kemu-backend/src/routes/myFeature.js
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET all items
router.get('/', async (req, res) => {
  try {
    const items = await prisma.myModel.findMany();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create (protected)
router.post('/', requireAuth, async (req, res) => {
  try {
    const item = await prisma.myModel.create({
      data: req.body
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
```

### 2. Register in Server

```javascript
// kemu-backend/src/server.js
import myFeatureRoutes from './routes/myFeature.js';
app.use('/api/my-feature', myFeatureRoutes);
```

### 3. Add Frontend API Functions

```typescript
// services/api.ts
export const getMyFeature = async (): Promise<any[]> => {
  const res = await api.get('/my-feature');
  return res.data;
};
```

---

## 🗄 Database Changes

### Adding a New Model

1. **Update Schema** (`prisma/schema.prisma`):
```prisma
model MyModel {
  id        Int      @id @default(autoincrement())
  name      String
  createdAt DateTime @default(now())
}
```

2. **Run Migration:**
```bash
cd kemu-backend
npx prisma migrate dev --name add_my_model
```

3. **Regenerate Client:**
```bash
npm run prisma:generate
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] All pages load without errors
- [ ] Navigation works correctly
- [ ] Forms submit successfully
- [ ] Data displays from API
- [ ] Admin panel CRUD operations work
- [ ] Chatbot responds appropriately
- [ ] Mobile responsive design

### API Testing

Use tools like Postman or curl:

```bash
# Get all programs
curl http://localhost:4000/api/programs

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kemu.ac.ke","password":"admin123"}'
```

---

## 🚢 Deployment

### Production Build

```bash
# Frontend
npm run build
# Output in dist/

# Backend
npm start  # in kemu-backend/
```

### Environment Variables (Production)

```env
NODE_ENV=production
PORT=4000
CORS_ORIGIN=https://your-domain.com
JWT_SECRET=very-long-secure-random-string
GEMINI_API_KEY=your-production-api-key
```

---

## 🐛 Debugging Tips

1. **Backend Logs:** Check terminal for error messages
2. **Browser DevTools:** Network tab for API calls
3. **React DevTools:** Component state inspection
4. **Prisma Studio:** Visual database inspection
   ```bash
   cd kemu-backend && npx prisma studio
   ```

---

## 📚 Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com/en/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/icons)

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Follow existing code style
3. Test thoroughly before committing
4. Write descriptive commit messages
5. Open pull request with details
