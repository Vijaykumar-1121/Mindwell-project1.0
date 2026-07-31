# MindWell

MindWell is a comprehensive mental health support platform designed to connect students with professional counselors, track their emotional well-being, and provide instant access to mental health resources.

## Features

### Student Portal
* **Mood Tracking**: Log daily moods and view historical trends through interactive charts.
* **Private Journal**: A secure space to reflect on thoughts and experiences.
* **Appointment Booking**: Schedule and manage in-person or virtual sessions with licensed counselors.
* **Resource Library**: Access curated articles, audio meditations, and reading materials.
* **AI Assistant**: Conversational AI chatbot for instant support and guidance.

### Admin Portal
* **Analytics Dashboard**: Monitor platform usage, active counselors, student signups, and overall mood trends.
* **User Management**: View, manage, and suspend student accounts as needed.
* **Counselor Management**: Add, update, and manage counselor profiles and availability.
* **Resource Management**: Upload and organize mental health resources accessible to students.

## Screenshots

### Landing Page
![Landing Page](screenshots/landing.png)

### Authentication
![Login Page](screenshots/login.png)

### Student Dashboard
![Student Dashboard](screenshots/student-dashboard.png)

### Admin Dashboard
![Admin Dashboard](screenshots/admin-dashboard.png)

## Technology Stack

* **Frontend**: HTML5, CSS3, Vanilla JavaScript
* **Backend**: Node.js, Express.js
* **Database**: MongoDB
* **Authentication**: JSON Web Tokens (JWT)
* **Integrations**: Groq API (AI Assistant)

## Project Structure

The project is structured into two main components:

1. `frontend/` - Contains all static HTML, CSS, and JavaScript files for the client-side application.
2. `backend/` - Contains the Node.js Express server, MongoDB schemas, and API routes.

## Deployment

The application is designed to be deployed across two separate services:

* **Backend API**: Can be hosted on platforms like Render, Heroku, or Railway. Requires environment variables for database connections and API keys.
* **Frontend Client**: Can be hosted on static hosting providers like Vercel or Netlify. The API base URL must be configured in `frontend/js/config.js` to point to the live backend service.
