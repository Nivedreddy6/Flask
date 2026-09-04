<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/banner.svg" alt="Job Sphere Studio Banner" width="100%" />
</p>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=24&duration=3000&pause=1000&color=6366F1&center=true&vCenter=true&multiline=true&width=700&height=70&lines=⚡+Job+Sphere+Studio+Recruitment+Ecosystem;🚀+Flask+REST+API+%2B+React+19+Vite+SPA;💼+Next-Gen+Applicant+Tracking+System" alt="Typing SVG" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Backend-Flask%203.0-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask" />
  <img src="https://img.shields.io/badge/Frontend-React%2019-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Bundler-Vite%208-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Database-SQLite%203-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
  <img src="https://img.shields.io/badge/Linter-Oxlint-F27244?style=for-the-badge&logo=rust&logoColor=white" alt="Oxlint" />
  <img src="https://img.shields.io/badge/UI%20Theme-Cyber%20Glassmorphic-8A2BE2?style=for-the-badge" alt="Design" />
</p>

---

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/headers/header-overview.svg" alt="Project Overview Header" width="100%" />
</p>

## 💡 What is Job Sphere Studio? (The Big Picture)

Traditional hiring is fragmented. Job seekers apply into black holes with no status feedback, while tech recruiters get buried in scattered emails, spreadsheets, and manual interview scheduling.

**Job Sphere Studio** is a complete, full-stack recruitment ecosystem designed to fix this. It seamlessly connects **Job Seekers** and **Recruiters** into a single, automated hiring machine:

1. **For Job Seekers**: A streamlined career portal where candidates search curated tech jobs with transparent salary ranges, apply with 1-click resume uploads, and track their applications live through every stage.
2. **For Recruiters**: A high-velocity **Applicant Tracking System (ATS)** where hiring managers can post vacancies, review resumes, advance candidates across stages, and schedule interviews with automated calendar-ready email invitations.
3. **For Engineering Teams**: A modern, decoupled hybrid architecture combining a high-performance **Flask REST Backend** (Python) with a reactive, glassmorphic **React 19 + Vite Frontend**.

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/cards/overview-cards.svg" alt="Overview Cards" width="100%" />
</p>

---

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/headers/header-features.svg" alt="Features Header" width="100%" />
</p>

## 🔄 End-to-End Website Walkthrough (How It Works)

Here is the exact step-by-step user journey from account creation to getting hired:

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/cards/workflow-journey.svg" alt="End-to-End Recruitment Journey" width="100%" />
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/cards/pipeline-stepper.svg" alt="Hiring Pipeline Stages" width="100%" />
</p>

---

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/headers/header-personas.svg" alt="User Personas Header" width="100%" />
</p>

## 🧭 Page-by-Page Feature Tour

<div align="center">
  <table>
    <tr>
      <td width="50%" align="center">
        <b>🏠 Candidate Portal & Discovery Feed</b><br/><br/>
        <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/home_screenshot.png" alt="Candidate Home" width="100%" />
      </td>
      <td width="50%" align="center">
        <b>🔐 Dual-Role Authentication & Access Control</b><br/><br/>
        <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/login_screenshot.png" alt="Login Portal" width="100%" />
      </td>
    </tr>
  </table>
</div>

### 🎯 1. Job Seeker Experience (Candidate Side)
* **Job Discovery Feed (`/seeker/jobs`)**: Instant multi-criteria search filtering by job title, department (Frontend, Backend, AI/ML, DevOps), employment type (Full-time, Remote, Hybrid), and salary tier.
* **1-Click Application (`/seeker/job/<id>`)**: Candidates can upload PDF/DOCX resumes and submit applications instantly.
* **Candidate Dashboard (`/seeker/dashboard`)**: Visual application tracker showing color-coded status badges: `Applied` ➔ `Reviewing` ➔ `Shortlisted` ➔ `Interview Scheduled` ➔ `Hired`.
* **Notifications Center (`/notifications`)**: Real-time alerts whenever a recruiter reviews an application, updates a stage, or schedules an interview.
* **Upskilling & Learning Hub (`/learning`)**: Integrated library of curated engineering tutorials, interview prep cheat-sheets, and system design roadmaps.
* **Tech Community Directory (`/people`)**: Peer networking portal to connect with fellow engineers and industry professionals.

### 🏢 2. Recruiter & ATS Command Suite (Employer Side)
* **Recruiter Command Dashboard (`/recruiter/dashboard`)**: Live recruitment KPIs showing active job count, applicant volume, shortlisted talent, and upcoming interviews.
* **Job Posting Wizard (`/recruiter/post_job`)**: Intuitive form to broadcast new job vacancies with custom salary ranges, required skill tags, and location preferences.
* **Candidate ATS Table (`/recruiter/applications`)**: Centralized applicant management table. Recruiters can view applicant bios, download submitted resumes securely, and advance candidate stages with a single click.
* **Automated Interview Scheduler (`/recruiter/schedule_interview`)**: Select candidate, pick date & time, add Google Meet / Zoom link, and write custom prep notes.
* **Automated SMTP Email Dispatcher**: When an interview is scheduled, the platform renders and delivers a branded HTML interview invitation directly to the candidate's inbox.
* **Company Profile Management (`/recruiter/company_profile`)**: Showcase company branding, logo, tech stack, culture, and active vacancies.

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/cards/personas-cards.svg" alt="Recruiter & Candidate Personas" width="100%" />
</p>

---

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/headers/header-architecture.svg" alt="System Architecture Header" width="100%" />
</p>

## 🏛 Technical Architecture & Technology Stack

The platform is designed with a **decoupled hybrid architecture** for optimal performance, responsiveness, and developer experience:

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/workflow.svg" alt="Workflow Pipeline Architecture" width="100%" />
</p>

```mermaid
flowchart TD
    subgraph Frontend [⚛️ React 19 Frontend SPA :5173]
        UI[🎨 Glassmorphism UI & Layout]
        Router[🛣️ Client-Side SPA Router]
        ATS_Table[📊 Interactive Candidate Tables & Analytics]
    end

    subgraph Backend [⚡ Flask 3.0 REST Backend :5000]
        API[🔌 RESTful Controllers]
        Auth[🔒 Session Auth & Password Hashing]
        Mailer[📧 Python SMTP Email Dispatcher]
    end

    subgraph Storage [💾 Relational Data Layer]
        DB[(🗄️ SQLite 3 + SQLAlchemy ORM)]
        Uploads[📁 Secure Resume Vault]
    end

    UI --> Router
    Router --> ATS_Table
    ATS_Table -->|Vite Proxy /api| API
    API --> Auth
    API --> Mailer
    API --> DB
    API --> Uploads
```

### 🛠️ Core Technologies Used:
* **Frontend**: **React 19**, **Vite 8**, **Lucide React** icons, custom cyber-glassmorphism CSS design system, and **Oxlint** (Rust-based sub-millisecond linter).
* **Backend**: **Python 3.12**, **Flask 3.0**, **Flask-SQLAlchemy** (ORM), **Werkzeug** (security & password hashing), and **Flask-CORS**.
* **Database**: **SQLite 3** relational database with automated seeding and foreign-key constraints.
* **Email Engine**: Python **`smtplib`** and **`email.mime`** for automated, responsive HTML email delivery.

---

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/headers/header-datamodel.svg" alt="Data Model Header" width="100%" />
</p>

## 📊 Relational Database Schema

The database model is built with SQLAlchemy with clean relational entities:

```mermaid
erDiagram
    USER ||--o{ USER_PROFILE : "has profile"
    USER ||--o{ COMPANY_PROFILE : "owns company"
    USER ||--o{ JOB_POSTING : "creates jobs"
    USER ||--o{ APPLICATION : "submits"
    USER ||--o{ NOTIFICATION : "receives alerts"
    JOB_POSTING ||--o{ APPLICATION : "receives"

    USER {
        int id PK
        string email UK
        string password_hash
        string role "seeker | recruiter"
        datetime created_at
    }

    USER_PROFILE {
        int id PK
        int user_id FK
        string full_name
        string headline
        string skills
        string resume_path
    }

    COMPANY_PROFILE {
        int id PK
        int user_id FK
        string company_name
        string industry
        string website
        string logo_url
    }

    JOB_POSTING {
        int id PK
        int recruiter_id FK
        string title
        string department
        string salary_range
        string status "Active | Closed"
        datetime created_at
    }

    APPLICATION {
        int id PK
        int job_id FK
        int seeker_id FK
        string status "Applied | Reviewing | Shortlisted | Interview Scheduled | Hired | Rejected"
        string resume_filename
        datetime applied_at
    }

    NOTIFICATION {
        int id PK
        int user_id FK
        string title
        string message
        boolean is_read
        datetime created_at
    }
```

---

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/headers/header-api.svg" alt="API Specification Header" width="100%" />
</p>

## 🔌 RESTful API Endpoints Specification

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/cards/api-endpoints.svg" alt="REST API Endpoints Specification" width="100%" />
</p>

---

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/headers/header-quickstart.svg" alt="Quickstart Header" width="100%" />
</p>

## ⚡ How to Run Locally

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/cards/terminal-quickstart.svg" alt="Animated Terminal Quickstart" width="100%" />
</p>

### 1️⃣ Launch Backend Server (Flask)
```powershell
# Activate Python Virtual Environment
.\Scripts\Activate.ps1

# Start Flask Backend Server on Port 5000
python backend/app.py
```
> 🌐 **Backend URL**: [http://127.0.0.1:5000](http://127.0.0.1:5000)

### 2️⃣ Launch Frontend Server (React 19 + Vite)
```powershell
# In a new terminal window:
cd frontend

# Install dependencies (first time only)
npm install

# Start Vite Development Server on Port 5173
npm run dev
```
> 🌐 **Frontend URL**: [http://localhost:5173](http://localhost:5173) *(automatically proxies `/api` calls to port 5000)*

---

<div align="center">
  <h3>✨ Job Sphere Studio — Engineering Tomorrow's Hiring Infrastructure ✨</h3>
  <p>Built with precision, automated workflows, and a modern developer experience.</p>
</div>
