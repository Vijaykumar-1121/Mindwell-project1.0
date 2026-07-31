# MindWell Platform

**MindWell** is a comprehensive, full-stack mental health support and wellness platform. It is engineered to bridge the gap between students seeking emotional support and professional counselors providing care. By combining traditional tracking tools (journaling, mood logging) with cutting-edge AI integrations (conversational chat and voice interfaces), MindWell provides an empathetic, 24/7 accessible environment for mental well-being.

This repository contains the complete source code for both the client-side frontend and the Node.js/Express backend API.

---

## Project Overview & Core Philosophy

The primary goal of MindWell is to make mental health resources highly accessible and less intimidating. The platform offers a dual-interface system:
1. **Student Portal**: A safe space for users to log their feelings, write private journals, interact with AI for immediate guidance, and schedule sessions with human counselors.
2. **Admin/Counselor Portal**: A management dashboard for administrators to analyze platform usage (mood trends, student signups) and for counselors to manage their schedules and appointments.

---

## Comprehensive Feature List

### AI Integrations (The Core Differentiator)
- **Real-Time AI Chat Assistant**: Powered by the **Groq API (Llama 3)**, this globally accessible floating chat widget provides immediate, context-aware mental health support, empathetic conversational responses, and navigation assistance across the app.
- **AI Voice Integration**: Integrates **Deepgram** (for high-speed speech-to-text transcription) and **ElevenLabs** (for natural text-to-speech synthesis). This allows students to have natural, spoken-word conversations with the AI, making therapy and guidance feel deeply human and accessible for those in distress who prefer talking over typing.

### Features
- **Daily Mood Tracker**: USers can log their mood daily on a 1-5 scale. This data is visualized using interactive line charts (via Chart.js) to help Users to identify emotional trends over weeks and months.
- **Private Journaling**: A rich-text journal where students can write reflections. Journals are strictly private and timestamped, serving as a therapeutic outlet.
- **Appointment Booking System**: A seamless interface to browse available licensed counselors, view their specializations, and book either in-person or virtual appointments.
- **Resource Library**: A curated repository of mental health articles, audio meditations, and reading materials to help with anxiety, stress, and focus.

### Admin & Management Features
- **Global Analytics Dashboard**: Visualizes critical platform metrics including total student count, active counselors, upcoming appointments, and aggregated mood trends across the platform.
- **User Management System**: Complete CRUD capabilities for managing student accounts, including the ability to temporarily suspend or unsuspend users who violate community guidelines.
- **Counselor Directory Management**: Admins can add new counselors to the platform, update their specialties, and remove inactive staff.
- **Dynamic Resource Management**: Admins can upload and publish new articles, audio files, and wellness guides directly to the student Resource Library.

---

## 🏗️ Architecture & Tech Stack

MindWell utilizes a **decoupled architecture**, meaning the frontend and backend operate independently and communicate strictly via RESTful APIs.

### Frontend Client
- **Core**: HTML5, CSS3, Vanilla JavaScript (No heavy frameworks like React/Vue, ensuring lightning-fast load times and straightforward DOM manipulation).
- **Styling**: Custom CSS with responsive design principles for mobile and desktop parity.
- **State & Auth**: Uses browser `localStorage` for persisting JWT tokens and managing session state.
- **Data Visualization**: **Chart.js** for rendering mood analytics and admin statistics.

### Backend API
- **Runtime**: **Node.js**
- **Framework**: **Express.js** for robust REST API routing and middleware management.
- **Database**: **MongoDB** with **Mongoose ODM** for flexible, document-based storage.
- **Security**: 
  - **Bcrypt.js** for secure password hashing.
  - **JSON Web Tokens (JWT)** for stateless, secure route authorization.
  - Role-based access control (RBAC) ensuring students cannot access admin endpoints.

---

##  Repository Structure & Code Navigation

```text
.
├── backend/
│   ├── src/
│   │   ├── api/            # Express route definitions (auth.js, users.js, journal.js)
│   │   ├── config/         # Database connection logic (db.js)
│   │   ├── controllers/    # Core business logic (handles req/res for all endpoints)
│   │   ├── middleware/     # Auth verification (authMiddleware.js) & error handlers
│   │   ├── models/         # Mongoose Schemas (User, JournalEntry, Appointment, etc.)
│   │   └── utils/          # Helper functions (e.g., generateToken.js)
│   ├── server.js           # Express application entry point & CORS configuration
│   └── package.json        # Backend dependencies
│
└── frontend/
    ├── admin/              # Admin HTML views (dashboard, manage-users)
    ├── student/            # Student HTML views (journal, appointments, mood-tracker)
    ├── assets/             # Static assets (images, icons, background audio)
    ├── css/                # Global and component-specific stylesheets
    ├── js/                 # Client-side JavaScript
    │   ├── config.js       # Global configuration containing the API_BASE_URL
    │   ├── global.js       # Global UI logic (sidebar toggles, AI chat widget)
    │   └── [feature].js    # Feature-specific logic (e.g., journal.js, auth.js)
    └── index.html          # Application landing page & routing entry
```

---

##  Setup & Installation Guide

For developers looking to run, modify, or contribute to MindWell, follow these steps to run the application locally.

### Prerequisites
- Node.js (v16 or higher)
- MongoDB account (Atlas) or local MongoDB instance
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/Vijaykumar-1121/Mindwell-project1.0.git
cd Mindwell-project1.0
```

### 2. Backend Environment Setup
Navigate to the backend directory and install the necessary Node modules:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory. You will need to configure the following variables:
```env
# Server Configuration
PORT=5000

# MongoDB Connection String
MONGO_URI=mongodb://<username>:<password>@<cluster-url>/mindwell

# Security Secrets
JWT_SECRET=your_super_secure_random_string
ADMIN_CODE=your_secret_admin_registration_code

# AI & Third-Party APIs
GROQ_API_KEY=your_groq_llama3_api_key
DEEPGRAM_API_KEY=your_deepgram_voice_transcription_key
```

Start the backend development server:
```bash
npm run dev
```
*The server will start listening on `http://localhost:5000`.*

### 3. Frontend Setup
Because the frontend is built with vanilla web technologies, no build step (like Webpack or Vite) is strictly required. 

Open a new terminal window:
```bash
cd frontend
```

You can serve the frontend using any static file server. If you have Node installed, you can use `serve`:
```bash
npx serve .
```

**Crucial Step:** During local development, ensure that your frontend is pointing to your local backend. Open `frontend/js/config.js` and verify that the base URL is set to localhost:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

---

## 🌐 Deployment Architecture

Because of the decoupled nature of the codebase, the application must be deployed as two distinct services.

1. **The Backend (Node/Express)**: 
   - Deploy the `backend/` directory to a Node.js hosting provider (such as **Render**, **Heroku**, or **Railway**).
   - Ensure all `.env` variables are manually added to the hosting provider's environment variable settings.
   
2. **The Frontend (Static Client)**: 
   - Deploy the `frontend/` directory to a static hosting provider (such as **Vercel**, **Netlify**, or **GitHub Pages**).
   - **Important**: Before deploying, update the `API_BASE_URL` in `frontend/js/config.js` to point to the live URL generated by your backend hosting provider in Step 1.

---

##  API Documentation Overview

The backend exposes a RESTful API. Below is a high-level overview of the core endpoints. *All endpoints (except auth) require a Bearer JWT token in the Authorization header.*

**Authentication & Users**
- `POST /api/auth/register` - Registers a new user. If `role` is passed as `admin`, it validates against the `ADMIN_CODE` in the `.env`.
- `POST /api/auth/login` - Authenticates a user and returns user data + JWT token.
- `GET /api/users/profile` - Retrieves the authenticated user's profile.

**Features**
- `GET /api/journal` - Fetches all journal entries belonging to the authenticated student.
- `POST /api/journal` - Creates a new private journal entry.
- `POST /api/mood` - Logs a new daily mood rating (1-5).
- `GET /api/appointments` - Retrieves all booked appointments.
- `POST /api/appointments` - Books a new counselor session.

**AI Integration**
- `POST /api/ai/chat` - Sends a conversation payload to the Groq API and streams back the Llama 3 response.

Thank you
