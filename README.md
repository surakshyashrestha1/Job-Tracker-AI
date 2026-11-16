# JobTracker AI

A full-stack MERN Job Application Tracking System built with React, Node.js, Express.js, and MongoDB.

## Features

- User Registration and Login
- Secure JWT Authentication
- Private User Dashboard
- Add, Edit, and Delete Job Applications
- Kanban Board with 5 Statuses
- Search and Filter Applications
- Board and List View
- Dashboard Statistics
- Resume and Job Description Matching
- Matching Percentage Calculation
- Matched and Missing Skills
- Resume Improvement Suggestions

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- JavaScript

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- Helmet

## Project Structure

jobtracker-ai/
  client/
    src/
      App.jsx
      AuthScreen.jsx
      JobBoard.jsx
      ResumeMatcher.jsx
      main.jsx

  server/
    src/
      config/
      middleware/
      models/
      routes/
      index.js
    .env

  README.md

## Installation

Clone the repository and install dependencies.

### Backend

cd server
npm install

Create a .env file inside server:

PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/jobtracker_ai
JWT_SECRET=your_own_secure_random_secret

Start MongoDB and run:

npm run dev

Backend: http://localhost:5000

### Frontend

Open another terminal:

cd client
npm install
npm run dev

Frontend: http://localhost:5173

## API Endpoints

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me

### Job Applications
- GET /api/jobs
- POST /api/jobs
- PATCH /api/jobs/:id
- DELETE /api/jobs/:id

Job endpoints require authentication.

## Resume Matching

The system compares resume text against job description skills.

It displays:
- Keyword matching percentage
- Matched skills
- Skills not detected in the resume
- Rule-based improvement suggestions

Note: Matching is keyword-based, not an official ATS score or AI model assessment.

## Security

- Password hashing
- JWT authentication using cookies
- Private user-owned applications
- Protected backend routes
- Rate limiting
- Environment variables excluded from Git

## Project Status

Core application features completed locally.
Live deployment and final production testing pending.

## Author

Suraksha Shrestha
BSc (Hons) Computer Systems Engineering
