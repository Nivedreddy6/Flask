<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/banner.svg" alt="Job Sphere Studio Banner" width="100%" />
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/cards/typing-badge-backend.svg" alt="Animated Backend Typing Badge" width="700" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Backend-Flask%203.0-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask" />
  <img src="https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/Database-SQLite%203-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
  <img src="https://img.shields.io/badge/ORM-SQLAlchemy-D71F00?style=for-the-badge&logo=sqlalchemy&logoColor=white" alt="SQLAlchemy" />
  <img src="https://img.shields.io/badge/Auth-JWT%20Tokens-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/Email-Flask--Mail-EA4335?style=for-the-badge&logo=gmail&logoColor=white" alt="Flask-Mail" />
</p>

---

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/headers/header-overview.svg" alt="Backend Overview Header" width="100%" />
</p>

## 💡 Job Sphere Backend Engine

The **Job Sphere Studio Backend** is a high-performance **Python + Flask 3.0 REST API** that powers authentication, vacancies, candidate applications, ATS stage transitions, and automated calendar notifications:

* 🔐 **Authentication & RBAC**: Dual-role authorization (`seeker` vs `recruiter`) with secure password hashing and session management.
* 📋 **Applicant Tracking System (ATS)**: Multi-stage hiring workflow (`Applied` ➔ `Reviewing` ➔ `Shortlisted` ➔ `Interview Scheduled` ➔ `Hired` / `Rejected`).
* 📧 **Automated Interview Scheduler**: Generates and dispatches responsive HTML interview invitation emails directly via SMTP (`Flask-Mail`).
* 💾 **Relational Data Layer**: Integrated SQLAlchemy ORM with pre-seeded jobs, company profiles, and instant query execution.

---

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/headers/header-datamodel.svg" alt="Database Schema Header" width="100%" />
</p>

## 📊 Relational Database Architecture

The SQLite relational database (`job_portal.db`) is structured with foreign key relationships across 6 core entities:

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/cards/database-schema.svg" alt="Relational Database Schema (SQLAlchemy ORM)" width="100%" />
</p>

---

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/headers/header-api.svg" alt="API Specification Header" width="100%" />
</p>

## 🔌 REST API Endpoints Specification

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/cards/api-endpoints.svg" alt="REST API Endpoints Specification" width="100%" />
</p>

---

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/headers/header-architecture.svg" alt="Interview Sequence Header" width="100%" />
</p>

## 🔄 Automated Interview Scheduling Pipeline

When a recruiter advances a candidate to the interview stage, the backend coordinates database updates and email dispatch:

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/cards/sequence-interview.svg" alt="Interview Scheduling Sequence Flow" width="100%" />
</p>

---

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/headers/header-quickstart.svg" alt="Quickstart Header" width="100%" />
</p>

## ⚡ How to Run the Backend Locally

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/cards/terminal-quickstart.svg" alt="Animated Terminal Quickstart" width="100%" />
</p>

### Manual Execution Steps

```bash
# 1. Activate Python virtual environment (Windows)
.\Scripts\activate

# 2. Install dependencies (if needed)
pip install -r backend/requirements.txt

# 3. Start the Flask server
python backend/app.py
```

The Flask API will initialize at **`http://127.0.0.1:5000`** with pre-seeded database records ready for requests.

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
