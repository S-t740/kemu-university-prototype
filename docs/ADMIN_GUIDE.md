# 🛠 Admin Panel User Guide

A comprehensive guide for managing the KeMU University website through the admin panel.

---

## 🔑 Accessing the Admin Panel

1. Navigate to `/#/admin` (e.g., `http://localhost:3001/#/admin`)
2. Log in with your credentials:
   - **Default Email:** `admin@kemu.ac.ke`
   - **Default Password:** `admin123`

> **Security Tip:** Change the default password after first login by updating the database.

---

## 📊 Dashboard Overview

The admin panel features a sidebar navigation with the following sections:

| Tab | Description |
|-----|-------------|
| Dashboard | Overview statistics |
| Schools | Manage academic schools |
| Programs | Manage degree programs |
| News | Publish news articles |
| Events | Manage campus events |
| Vacancies | Post job openings |
| Applications | Review job applications |
| Student Services | Manage student services |
| Directorates | Manage university units |
| AI Conversations | Monitor chatbot chats |

---

## 🏫 Managing Schools

Schools represent academic faculties/departments.

### Creating a School
1. Go to **Schools** tab
2. Click **Add School**
3. Fill in:
   - **Name:** Full school name
   - **Slug:** URL-friendly identifier (auto-generated)
   - **Overview:** Description of the school
4. Click **Save**

### Editing/Deleting
- Click the **Edit** button to modify
- Click **Delete** to remove (will also delete associated programs)

---

## 📚 Managing Programs

Academic programs are linked to schools.

### Creating a Program
1. Go to **Programs** tab
2. Click **Add Program**
3. Fill in:
   - **Title:** Program name
   - **School:** Select parent school
   - **Degree Type:** Certificate/Diploma/Degree/Masters/PhD
   - **Duration:** Program length
   - **Overview:** Program description
   - **Requirements:** Entry requirements
4. Click **Save**

### Editing Programs
Click **Edit** to modify program details or reassign to a different school.

---

## 📰 Managing News

Publish news articles and announcements.

### Creating News
1. Go to **News** tab
2. Click **Add News**
3. Fill in:
   - **Title:** Article headline
   - **Summary:** Brief overview (appears in cards)
   - **Content:** Full article (supports rich text)
   - **Author:** Writer's name
   - **Images:** Add up to 5 image URLs
4. Click **Publish**

### Best Practices
- Use engaging headlines
- Include featured images
- Keep summaries under 150 characters

---

## 📅 Managing Events

Promote campus events and activities.

### Creating an Event
1. Go to **Events** tab
2. Click **Add Event**
3. Fill in:
   - **Title:** Event name
   - **Date & Time:** When it occurs
   - **Venue:** Location
   - **Details:** Event description
   - **Images:** Event photos
4. Click **Save**

### Tips
- Include clear venue directions
- Add event highlights in details
- Update or remove past events

---

## 💼 Managing Vacancies

Post job openings and career opportunities.

### Creating a Vacancy
1. Go to **Vacancies** tab
2. Click **Add Vacancy**
3. Fill in:
   - **Title:** Job position
   - **Department:** Hiring department
   - **Location:** Campus/office
   - **Type:** Academic/Administrative/Support Staff
   - **Description:** Role responsibilities
   - **Requirements:** Qualifications needed
   - **Deadline:** Application closing date
   - **Images:** Optional position images
4. Click **Post Vacancy**

### Managing Listings
- Vacancies automatically hide after deadline
- Use **View All** to see expired listings

---

## 📋 Reviewing Applications

Process job applications from candidates.

### Application Workflow
1. Go to **Applications** tab
2. View all applications or filter by:
   - Vacancy
   - Status
   - Search term

### Application Statuses
| Status | Description |
|--------|-------------|
| `Pending` | New submission |
| `Reviewing` | Under consideration |
| `Shortlisted` | Selected for next round |
| `Interview` | Interview scheduled |
| `Rejected` | Not moving forward |
| `Hired` | Offer extended |

### Processing an Application
1. Click on an application
2. Review details:
   - Personal information
   - Cover letter
   - Download CV
   - View additional documents
3. Update status using dropdown
4. Add admin notes (private)
5. Click **Save**

---

## 🎓 Managing Student Services

Configure student support services.

### Creating a Service
1. Go to **Student Services** tab
2. Click **Add Service**
3. Fill in:
   - **Title:** Service name
   - **Slug:** URL identifier
   - **Summary:** Brief description
   - **Details:** Bullet points (JSON array)
   - **URL:** External link (optional)
   - **Sort Order:** Display position
   - **Active:** Toggle visibility
4. Click **Save**

---

## 🏛 Managing Directorates

Configure university directorates/units.

### Creating a Directorate
1. Go to **Directorates** tab
2. Click **Add Directorate**
3. Fill in:
   - **Name:** Directorate name
   - **Slug:** URL identifier
   - **Overview:** Description
4. Click **Save**

---

## 🤖 AI Conversations

Monitor and manage chatbot interactions.

### Viewing Conversations
1. Go to **AI Conversations** tab
2. View list of chat sessions
3. Click to see full conversation history

### Actions
- **Mark Resolved:** Close completed conversations
- **Delete:** Remove conversation

### Privacy Note
Conversations with `isLogged: false` are not stored.

---

## 📬 Inbox (Inquiries)

Access via the separate **Inbox** page (`/#/inbox`).

### Managing Inquiries
1. View all submitted inquiries
2. Click to read full message
3. Mark as read/unread
4. Delete when resolved

### Sources
- `contact-form` - Website contact form
- `chatbot` - Escalated from AI chat

---

## 🔐 Security Best Practices

1. **Change default password** immediately
2. **Log out** when finished
3. **Don't share credentials**
4. Use **strong passwords** (min 12 characters)
5. Access only from **trusted networks**

---

## ❓ Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't log in | Check credentials, ensure backend is running |
| Changes not saving | Check network connection, try refreshing |
| Images not showing | Verify image URLs are accessible |
| Backend errors | Check terminal for error messages |

---

## 📞 Support

For technical issues, contact the development team or check the [Developer Guide](DEVELOPER_GUIDE.md).
