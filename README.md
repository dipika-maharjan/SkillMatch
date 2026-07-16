# SkillMatch

SkillMatch is a comprehensive, AI-powered full-stack web application designed to connect job seekers with relevant job opportunities by analyzing their resumes and matching their skills with job requirements.

## Features

- **Role-based Authentication**: Secure login and registration for both Candidates (Users) and Administrators, powered by JWT and bcrypt.
- **AI Resume Parsing**: Users can upload their resumes (PDF, DOCX) and SkillMatch uses AI to extract key skills and provide a detailed skill breakdown and match score.
- **Smart Job Matching**: Suggests jobs to users based on an intelligent comparison between their profile/resume skills and job requirements.
- **Job Management**: Users can search, filter, view details, apply for, and save jobs for later.
- **Admin Dashboard**: A dedicated portal for administrators to manage jobs, view applicant details, handle applications, and monitor user activity.
- **Real-time Notifications**: Keep track of application updates and new recommendations.

## Screenshots

### Home

![Home](frontend/src/assets/screenshots/homepage.png)

### Login

![Login](frontend/src/assets/screenshots/login.png)

### Register

![Register](frontend/src/assets/screenshots/register.png)

### Forgot Password

![Forgot Password](frontend/src/assets/screenshots/forgot-password.png)

### Dashboard

![Dashboard](frontend/src/assets/screenshots/dashboard.png)

### Jobs

![Jobs](frontend/src/assets/screenshots/jobs.png)

### Job Details

![Job Details](frontend/src/assets/screenshots/job-detail.png)

### Company Details

![Company Details](frontend/src/assets/screenshots/company-details.png)

### Applications

![Applications](frontend/src/assets/screenshots/applications.png)

### Saved Jobs

![Saved Jobs](frontend/src/assets/screenshots/saved-jobs.png)

### Resume

![Resume](frontend/src/assets/screenshots/resume.png)

### Resume Analysis

![Resume Analysis](frontend/src/assets/screenshots/resume-analysis.png)

### Settings

![Settings](frontend/src/assets/screenshots/settings.png)

### Profile

![Profile](frontend/src/assets/screenshots/profile.png)

### Notifications

![Notifications](frontend/src/assets/screenshots/notifications.png)

### Change Password

![Change Password](frontend/src/assets/screenshots/change-password.png)

### AI Assistant

![AI Assistant](frontend/src/assets/screenshots/ai-assistant.png)

### Admin Dashboard

![Admin Dashboard](frontend/src/assets/screenshots/admin-dashboard.png)

### Admin User

![Admin User](frontend/src/assets/screenshots/admin-user.png)

### Admin Jobs

![Admin Jobs](frontend/src/assets/screenshots/admin-jobs.png)

### Admin Applications

![Admin Applications](frontend/src/assets/screenshots/admin-applications.png)

### Admin Analytics

![Admin Analytics](frontend/src/assets/screenshots/admin-analytics.png)

## Tech Stack

### Frontend

- **Framework**: React 19 (built with Vite)
- **Styling**: Tailwind CSS for responsive and modern UI
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **HTTP Client**: Axios

### Backend

- **Runtime Environment**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **AI Integration**: Google GenAI API (`@google/genai`) for resume analysis
- **File Parsing**: `pdf-parse` (for PDFs) and `mammoth` (for DOCX)
- **File Uploads**: Multer
- **Email Services**: Nodemailer

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB running locally or a MongoDB Atlas URI
- An OpenRouter / Gemini API Key (for the AI resume parser)

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd SkillMatch
   ```

2. **Setup the Backend:**

   ```bash
   cd backend
   npm install
   ```

   - Create a `.env` file in the `backend` directory based on the following template:
     ```env
     PORT=5000
     MONGO_URI=mongodb://localhost:27017/skillmatch
     JWT_SECRET=your_super_secret_jwt_key
     CLIENT_URL=http://localhost:5173
     OPENROUTER_API_KEY=your_api_key_here
     EMAIL_USER=your_email@gmail.com
     EMAIL_PASS=your_email_app_password
     ```
   - Start the backend server:
     ```bash
     npm run dev
     ```

3. **Setup the Frontend:**

   ```bash
   cd ../frontend
   npm install
   ```

   - Start the development server:
     ```bash
     npm run dev
     ```

4. **Access the application:**
   Open your browser and navigate to `http://localhost:5173`.

## Folder Structure

```
SkillMatch/
├── backend/                  # Express server
│   ├── controllers/          # Request handlers
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API endpoint definitions
│   ├── middleware/           # Auth and file handling middleware
│   └── server.js             # Entry point
└── frontend/                 # React application
    ├── src/
    │   ├── components/       # Reusable UI components
    │   ├── pages/            # Page components (Dashboard, Jobs, etc.)
    │   ├── services/         # API configurations
    │   └── App.jsx           # Main application routing
    ├── package.json
    └── vite.config.js
```
