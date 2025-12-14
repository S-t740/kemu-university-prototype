# KeMU Backend API

Backend API server for Kenya Methodist University prototype built with Node.js, Express, Prisma, and SQLite.

## Features

- RESTful API for managing schools, programs, news, events, and inquiries
- Admin authentication system
- SQLite database with Prisma ORM
- CORS enabled for frontend integration
- Email notification stubs for inquiries

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT tokens + demo token for prototype
- **Validation**: Built-in Express validation

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` if needed (defaults work for development).

### 3. Database Setup

Generate Prisma Client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate dev --name init
```

Seed the database:

```bash
node prisma/seed.js
```

### 4. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:4000`

## API Endpoints

### Authentication

- `POST /api/admin/login` - Admin login
- `POST /api/admin/register` - Admin registration (dev only)

### Schools

- `GET /api/schools` - Get all schools
- `GET /api/schools/:id` - Get school by ID
- `POST /api/schools` - Create school (admin)
- `PUT /api/schools/:id` - Update school (admin)
- `DELETE /api/schools/:id` - Delete school (admin)

### Programs

- `GET /api/programs` - Get all programs (supports ?q=, ?degree=, ?schoolId=)
- `GET /api/programs/:slug` - Get program by slug
- `POST /api/programs` - Create program (admin)
- `PUT /api/programs/:id` - Update program (admin)
- `DELETE /api/programs/:id` - Delete program (admin)

### News

- `GET /api/news` - Get all news (supports ?limit=)
- `GET /api/news/:slug` - Get news by slug
- `POST /api/news` - Create news (admin)
- `PUT /api/news/:id` - Update news (admin)
- `DELETE /api/news/:id` - Delete news (admin)

### Events

- `GET /api/events` - Get upcoming events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event (admin)
- `PUT /api/events/:id` - Update event (admin)
- `DELETE /api/events/:id` - Delete event (admin)

### Inquiries

- `POST /api/inquiries` - Create inquiry (public)
- `GET /api/inquiries` - Get all inquiries (admin)
- `PUT /api/inquiries/:id/mark-read` - Mark inquiry as read (admin)
- `DELETE /api/inquiries/:id` - Delete inquiry (admin)

## Authentication

For prototype mode, use the header:
```
x-demo-token: demo-token
```

For production, use JWT:
```
Authorization: Bearer <token>
```

## Default Admin Credentials

- **Email**: admin@kemu.test
- **Password**: password

## Database Schema

See `prisma/schema.prisma` for the complete database schema.

## Development

- `npm run dev` - Start with nodemon (auto-reload)
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run migrations
- `npm run prisma:seed` - Seed database

## Production

1. Set `NODE_ENV=production` in `.env`
2. Use a production database (PostgreSQL recommended)
3. Set a strong `JWT_SECRET`
4. Configure proper CORS origins
5. Set up email service for inquiry notifications

## License

ISC


