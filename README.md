<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/banner.svg" alt="Job Sphere Studio Banner" width="100%" />
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/cards/typing-badge-root.svg" alt="Animated Typing Badge" width="700" />
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

## 💡 What is Job Sphere Studio?

**Job Sphere Studio** is a full-stack recruitment platform and automated Applicant Tracking System (ATS). It connects **Job Seekers** with **Recruiters** by streamlining the entire hiring lifecycle:

* 🎯 **For Job Seekers**: Search tech jobs with transparent salary ranges, apply with 1-click resume uploads, and track real-time application status.
* ⚡ **For Recruiters**: Post vacancies, review candidate pipelines, advance hiring stages, and schedule interviews with automated calendar-ready emails.

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

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/cards/features-deepdive.svg" alt="Comprehensive Feature Tour" width="100%" />
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

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/cards/system-architecture.svg" alt="System Architecture & Data Flow" width="100%" />
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/cards/sequence-interview.svg" alt="Automated Interview Scheduling Sequence Flow" width="100%" />
</p>

### 🛠️ Core Technologies Used:
* **Frontend**: **React 19**, **Vite 8**, **Lucide React** icons, custom cyber-glassmorphism CSS design system, and **Oxlint** (Rust-based sub-millisecond linter).
* **Backend**: **Python 3.12**, **Flask 3.0**, **Flask-SQLAlchemy** (ORM), **Werkzeug** (security & password hashing), and **Flask-CORS**.
* **Database**: **SQLite 3** relational database with automated seeding and foreign-key constraints.
* **Email Engine**: Python **`smtplib`** and **`email.mime`** for automated, responsive HTML email delivery.

---

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/headers/header-backend.svg" alt="Flask Backend Engine Header" width="100%" />
</p>

## ⚡ Flask Backend Engine & Internal Services

The backend is built as a modular, lightweight, high-performance Python 3.12 + Flask 3.0 REST API:

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/cards/backend-services.svg" alt="Flask Backend Architecture & Internal Services" width="100%" />
</p>

### 🧩 Backend Module Breakdown

| Module | Primary Responsibility | Key Features & Implementation |
| :--- | :--- | :--- |
| **[`backend/app.py`](file:///c:/Users/nived/OneDrive/Documents/flask/backend/app.py)** | **REST API Dispatcher & Auth** | • JSON REST endpoint routing<br/>• Role-Based Access Control (`seeker` vs `recruiter`)<br/>• `Werkzeug` PBKDF2 password hashing & session management<br/>• `Flask-CORS` middleware for Vite React client<br/>• Secure resume upload handler (`/static/uploads/`) |
| **[`backend/models.py`](file:///c:/Users/nived/OneDrive/Documents/flask/backend/models.py)** | **SQLAlchemy Relational ORM** | • 6 Normalized database entities with foreign keys<br/>• `User` & `UserProfile` 1-to-1 candidate relationship<br/>• `CompanyProfile` recruiter company branding<br/>• `JobPosting` & `Application` ATS stage management<br/>• `Notification` live user alert models |
| **[`backend/email_service.py`](file:///c:/Users/nived/OneDrive/Documents/flask/backend/email_service.py)** | **Automated Interview Mailer** | • Python `smtplib` & `email.mime` HTML dispatcher<br/>• Structured calendar invites with date, time & video conference links<br/>• Branded responsive HTML email templates<br/>• Non-blocking fallback logging if SMTP is unreachable |
| **[`backend/database.py`](file:///c:/Users/nived/OneDrive/Documents/flask/backend/database.py)** | **DB Lifecycle & Auto-Seeder** | • SQLite 3 zero-configuration database (`job_portal.db`)<br/>• Idempotent schema initialization on startup<br/>• Realistic demo seed generator (Companies, Jobs, Candidates, Applications) |


---

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/headers/header-datamodel.svg" alt="Data Model Header" width="100%" />
</p>

## 📊 Relational Database Schema

The database model is built with SQLAlchemy with clean relational entities:

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/cards/database-schema.svg" alt="Relational Database Schema (SQLAlchemy ORM)" width="100%" />
</p>


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

---

<p align="center">
  <a href="https://github.com/Nivedreddy6" target="_blank">
    <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/cards/author-footer.svg" alt="Created by Nived Reddy" width="100%" />
  </a>
</p>

<p align="center">
  <a href="https://github.com/Nivedreddy6" target="_blank"><img src="https://img.shields.io/badge/GitHub-View%20Profile%20%40Nivedreddy6-181717?style=for-the-badge&logo=github&logoColor=white" alt="View GitHub Profile" /></a>
  <a href="https://github.com/Nivedreddy6/Flask" target="_blank"><img src="https://img.shields.io/badge/Star%20Repo-⭐%20GitHub-FFD700?style=for-the-badge&logo=github&logoColor=black" alt="Star on GitHub" /></a>
  <a href="https://github.com/Nivedreddy6/Flask/fork" target="_blank"><img src="https://img.shields.io/badge/Fork%20Repo-🍴%20Contribute-2ea44f?style=for-the-badge&logo=github&logoColor=white" alt="Fork on GitHub" /></a>
</p>

<div align="center">
  <b>Job Sphere Studio</b> • Developed with ❤️ by <a href="https://github.com/Nivedreddy6" target="_blank"><b>Nived Reddy (@Nivedreddy6)</b></a>
</div>
