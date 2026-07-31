# MindWell Platform

MindWell is a full-stack mental health support platform designed to connect students with professional counselors. The application provides tools for emotional tracking, journaling, resource discovery, and appointment booking, supported by a conversational AI assistant.

This repository utilizes a dual-architecture design consisting of a static frontend and a Node.js REST API backend.

## Architecture & Tech Stack

### Frontend
- **HTML5/CSS3/Vanilla JS**: Built without complex frameworks to ensure lightweight performance and ease of understanding.
- **Dynamic Data Fetching**: Utilizes the standard Fetch API to communicate with the backend.
- **Authentication**: JWT tokens stored in `localStorage` handle session persistence.
- **Charting**: Uses Chart.js for rendering mood tracking analytics.

### Backend
- **Node.js & Express.js**: Handles API routing, middleware, and business logic.
- **MongoDB & Mongoose**: NoSQL database for flexible document storage (Users, Appointments, Journals, Moods, etc.).
- **Security**: Password hashing via bcrypt, stateless authentication via JWT.
- **Integrations**: Groq API for the AI Assistant, Deepgram (optional audio processing).

## Repository Structure

```text
.
├── backend/
│   ├── src/
│   │   ├── api/            # Express route definitions
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Business logic for routes
│   │   ├── middleware/     # Auth and error handling middleware
│   │   ├── models/         # Mongoose database schemas
│   │   └── utils/          # Helper functions (e.g., token generation)
│   ├── server.js           # Express application entry point
│   └── package.json        # Backend dependencies
│
└── frontend/
    ├── admin/              # Admin dashboard HTML views
    ├── student/            # Student dashboard HTML views
    ├── assets/             # Images, icons, and audio files
    ├── css/                # Stylesheets
    ├── js/                 # Client-side JavaScript
    │   └── config.js       # Global configuration (API Base URL)
    └── index.html          # Application landing page
```

## Setup & Installation

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB account (Atlas) or local MongoDB instance
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/Vijaykumar-1121/Mindwell-project1.0.git
cd Mindwell-project1.0
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
ADMIN_CODE=your_admin_registration_code
GROQ_API_KEY=your_groq_api_key
```

Start the backend development server:
```bash
npm run dev
```
The server will run on `http://localhost:5000`.

### 3. Frontend Setup
The frontend consists of static files. To run it locally, you can use any static file server (e.g., VS Code Live Server, or `npx serve`).
```bash
# Example using npx
cd ../frontend
npx serve .
```

**Important**: Ensure the frontend is pointing to your backend. Check `frontend/js/config.js` and set the `API_BASE_URL` to `http://localhost:5000/api` during local development.

## Deployment Guidelines

Because of the separated architecture, the application should be deployed as two distinct services:

1. **Backend**: Deploy the `backend/` folder to a Node.js hosting provider (e.g., Render, Heroku, DigitalOcean). Ensure all environment variables from your `.env` are configured on the hosting provider.
2. **Frontend**: Deploy the `frontend/` folder to a static hosting provider (e.g., Vercel, Netlify). Before deploying, update `frontend/js/config.js` to point to the live backend URL.

## Core API Endpoints

- `POST /api/auth/register` - Register a new user or admin
- `POST /api/auth/login` - Authenticate and receive JWT
- `GET /api/users/profile` - Retrieve current user profile
- `GET /api/journal` - Fetch user journal entries
- `POST /api/appointments` - Book a new session
- `POST /api/ai/chat` - Interact with the AI Assistant

*Detailed endpoint parameters and responses can be found within the `backend/src/controllers` directory.*
