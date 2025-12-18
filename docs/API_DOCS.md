# 📡 KeMU API Documentation

This document provides comprehensive documentation for all backend API endpoints.

**Base URL:** `http://localhost:4000/api`

---

## 🔐 Authentication

### POST `/auth/login`
Authenticate admin users and receive a JWT token.

**Request Body:**
```json
{
  "email": "admin@kemu.ac.ke",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@kemu.ac.ke",
    "role": "admin"
  }
}
```

**Protected Routes:** Include the token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 🏫 Schools

### GET `/schools`
Get all schools.

**Response:** `Array<School>`
```json
[
  {
    "id": 1,
    "name": "School of Computing",
    "slug": "school-of-computing",
    "overview": "Description...",
    "programs": [...]
  }
]
```

### POST `/schools` 🔒
Create a new school.

**Request Body:**
```json
{
  "name": "School of Science",
  "slug": "school-of-science",
  "overview": "Description..."
}
```

### PUT `/schools/:id` 🔒
Update an existing school.

### DELETE `/schools/:id` 🔒
Delete a school.

---

## 📚 Programs

### GET `/programs`
Get all academic programs.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `q` | string | Search query |
| `degree` | string | Filter by degree type |

**Response:** `Array<Program>`

### GET `/programs/:slug`
Get a single program by slug.

### POST `/programs` 🔒
Create a new program.

**Request Body:**
```json
{
  "title": "Bachelor of Computer Science",
  "slug": "bsc-computer-science",
  "degreeType": "Degree",
  "duration": "4 Years",
  "overview": "Program description...",
  "requirements": "Entry requirements...",
  "schoolId": 1
}
```

### PUT `/programs/:id` 🔒
Update an existing program.

### DELETE `/programs/:id` 🔒
Delete a program.

---

## 📰 News

### GET `/news`
Get all news articles.

**Response:** `Array<NewsItem>`

### GET `/news/:slug`
Get a single news article by slug.

### POST `/news` 🔒
Create a news article.

**Request Body:**
```json
{
  "title": "University Announcement",
  "slug": "university-announcement",
  "summary": "Brief summary...",
  "content": "Full article content...",
  "author": "Admin",
  "images": ["url1", "url2"]
}
```

### PUT `/news/:id` 🔒
Update a news article.

### DELETE `/news/:id` 🔒
Delete a news article.

---

## 📅 Events

### GET `/events`
Get all events.

**Response:** `Array<EventItem>`

### POST `/events` 🔒
Create an event.

**Request Body:**
```json
{
  "title": "Graduation Ceremony",
  "date": "2024-12-15T10:00:00Z",
  "venue": "Main Campus Auditorium",
  "details": "Event description...",
  "images": ["url1"]
}
```

### PUT `/events/:id` 🔒
Update an event.

### DELETE `/events/:id` 🔒
Delete an event.

---

## 💼 Vacancies

### GET `/vacancies`
Get active (non-expired) vacancies.

### GET `/vacancies/all` 🔒
Get all vacancies including expired ones.

### GET `/vacancies/:slug`
Get a single vacancy by slug.

### POST `/vacancies` 🔒
Create a vacancy (multipart/form-data for image uploads).

**Form Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Job title |
| `slug` | string | URL slug |
| `department` | string | Department name |
| `location` | string | Job location |
| `type` | string | Academic/Administrative |
| `description` | string | Job description |
| `requirements` | string | Requirements |
| `deadline` | string | Application deadline |
| `images` | files | Optional images |

### PUT `/vacancies/:id` 🔒
Update a vacancy.

### DELETE `/vacancies/:id` 🔒
Delete a vacancy.

---

## 📋 Applications

### GET `/applications` 🔒
Get all job applications.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status |
| `vacancyId` | number | Filter by vacancy |
| `search` | string | Search applicant name |

### GET `/applications/:id` 🔒
Get a single application.

### GET `/applications/vacancy/:id` 🔒
Get applications for a specific vacancy.

### GET `/applications/stats` 🔒
Get application statistics.

### POST `/applications`
Submit a job application (multipart/form-data).

**Form Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `vacancyId` | number | Vacancy ID |
| `firstName` | string | First name |
| `lastName` | string | Last name |
| `email` | string | Email address |
| `phone` | string | Phone number |
| `coverLetter` | string | Cover letter text |
| `cv` | file | CV document (PDF/Word) |
| `documents` | files | Additional documents |

### PUT `/applications/:id/status` 🔒
Update application status.

**Request Body:**
```json
{
  "status": "shortlisted",
  "adminNotes": "Strong candidate"
}
```

**Status Values:** `pending`, `reviewing`, `shortlisted`, `interview`, `rejected`, `hired`

### DELETE `/applications/:id` 🔒
Delete an application.

---

## 📬 Inquiries

### GET `/inquiries` 🔒
Get all inquiries.

### GET `/inquiries/:id` 🔒
Get a single inquiry.

### POST `/inquiries`
Submit an inquiry.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Inquiry message...",
  "source": "contact-form"
}
```

### PUT `/inquiries/:id/mark-read` 🔒
Toggle inquiry read status.

### DELETE `/inquiries/:id` 🔒
Delete an inquiry.

---

## 📊 Statistics

### GET `/stats`
Get site statistics.

**Response:**
```json
{
  "programs": 50,
  "news": 25,
  "events": 10,
  "students": 15000,
  "campuses": 4
}
```

---

## 🤖 AI Chat

### POST `/chat/message`
Send a message to the AI chatbot.

**Request Body:**
```json
{
  "message": "What programs do you offer?",
  "sessionId": "unique-session-id",
  "isLogged": true
}
```

**Response:**
```json
{
  "response": "AI response text...",
  "sessionId": "unique-session-id"
}
```

### GET `/chat/conversations` 🔒
Get all chat conversations.

### DELETE `/chat/conversations/:id` 🔒
Delete a conversation.

### PUT `/chat/conversations/:id/resolve` 🔒
Mark conversation as resolved.

---

## 📖 Knowledge Base

### GET `/knowledge`
Get knowledge base content for AI chatbot context.

---

## 🎓 Student Services

### GET `/student-services`
Get all student services.

### GET `/student-services/:slug`
Get a single service by slug.

### POST `/student-services` 🔒
Create a student service.

**Request Body:**
```json
{
  "slug": "counselling",
  "title": "Counselling Services",
  "summary": "Description...",
  "details": ["Point 1", "Point 2"],
  "url": "https://example.com",
  "sortOrder": 1,
  "isActive": true
}
```

### PUT `/student-services/:id` 🔒
Update a student service.

### DELETE `/student-services/:id` 🔒
Delete a student service.

---

## 🏛 Directorates

### GET `/directorates`
Get all directorates.

### POST `/directorates` 🔒
Create a directorate.

### PUT `/directorates/:id` 🔒
Update a directorate.

### DELETE `/directorates/:id` 🔒
Delete a directorate.

---

## 🔒 Authentication Legend

| Symbol | Meaning |
|--------|---------|
| 🔒 | Protected route (requires JWT token) |

---

## ⚠️ Error Responses

All errors return a JSON object with a message:

```json
{
  "message": "Error description"
}
```

**Common Status Codes:**
| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid/missing token |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

---

## 📁 File Uploads

Uploaded files are served statically at:
```
http://localhost:4000/uploads/<filename>
```
