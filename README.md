<p align="center">
  <img src="./frontend/public/banner.svg" alt="Job Sphere Studio Banner" width="100%" />
</p>

<p align="center">
  <a href="https://flask.palletsprojects.com/"><img src="https://img.shields.io/badge/Backend-Flask%203.0-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/Frontend-React%2019-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" /></a>
  <a href="https://vite.dev/"><img src="https://img.shields.io/badge/Bundler-Vite%208-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" /></a>
  <a href="https://www.sqlite.org/"><img src="https://img.shields.io/badge/Database-SQLite%20%2F%20SQLAlchemy-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Architecture-Full--Stack%20Decoupled-8A2BE2?style=for-the-badge" alt="Architecture" /></a>
</p>

---

<div align="center">

# 🌐 Job Sphere Studio — Full-Stack Recruitment Ecosystem
A modern, complete job board and recruitment management platform powered by a **Flask REST & Session Backend** and a **React 19 + Vite Frontend SPA**.

</div>

---

## 🏛 System Architecture & Dataflow

<p align="center">
  <img src="./frontend/public/workflow.svg" alt="Workflow Pipeline" width="100%" />
</p>

---

## 🚀 Running the Full-Stack Application

### 1️⃣ Start Flask Backend (Port `5000`)
```powershell
# Activate virtual environment
.\Scripts\Activate.ps1

# Run Flask backend server
python backend/app.py
```
> Flask API & Traditional Templates: **http://127.0.0.1:5000**

### 2️⃣ Start React Frontend (Port `5173`)
```powershell
# In another terminal window:
cd frontend
npm run dev
```
> React SPA Client: **http://localhost:5173** (Proxies `/api` to port `5000`)

---

## 📂 Project Structure

```text
flask/
├── backend/
│   ├── app.py               # Flask application core, auth & routes
│   ├── database.py          # DB initialization & seeding
│   ├── models.py            # SQLAlchemy database models
│   ├── email_service.py     # SMTP interview invitation dispatcher
│   ├── routes/              # Specialized API controllers
│   ├── static/              # Backend static assets & uploaded resumes
│   └── templates/           # Jinja2 server-rendered templates
│
├── frontend/
│   ├── public/              # Animated SVGs & public assets
│   ├── src/                 # React 19 components, pages, design system
│   ├── package.json         # React & tooling dependencies
│   ├── vite.config.ts       # Vite build & proxy settings
│   └── README.md            # Frontend documentation
│
└── README.md                # Root project documentation
```

---

<p align="center">
  Crafted with ✨ for seamless recruitment workflows.
</p>
