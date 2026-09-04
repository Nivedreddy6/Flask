<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/banner.svg" alt="Job Sphere Studio Banner" width="100%" />
</p>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=24&duration=3000&pause=1000&color=6366F1&center=true&vCenter=true&multiline=true&width=700&height=70&lines=⚡+Job+Sphere+Studio+Frontend+SPA;🚀+React+19+%2B+Vite+8+%2B+Glassmorphism+UI;💼+Applicant+Tracking+System+Client" alt="Typing SVG" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Flask-3.0-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask" />
  <img src="https://img.shields.io/badge/Linter-Oxlint-F27244?style=for-the-badge&logo=rust&logoColor=white" alt="Oxlint" />
  <img src="https://img.shields.io/badge/Icons-Lucide%20React-F56565?style=for-the-badge" alt="Lucide React" />
  <img src="https://img.shields.io/badge/Status-Active%20%E2%9C%94-00C853?style=for-the-badge" alt="Status Active" />
</p>

---

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/headers/header-overview.svg" alt="Overview Header" width="100%" />
</p>

## 💡 What is the Job Sphere Studio Frontend?

The **Job Sphere Studio Frontend** is a high-performance Single Page Application (SPA) engineered with **React 19** and **Vite 8**. It serves as the primary modern user interface for both **Recruiters** and **Job Seekers**, communicating with the Flask backend API.

### 🌟 Key Responsibilities:
1. **Interactive Recruiter ATS Dashboard**: View applicant metrics, transition candidates between review stages in real-time, and trigger interview scheduling modals.
2. **Dynamic Candidate Discovery & Application**: Instant multi-facet job search with salary filters and 1-click resume uploads.
3. **Automated Interview Workflow**: Modal interface for setting meeting times and video links, triggering automated SMTP invitation emails through the backend.
4. **Tailored Cyber-Glassmorphism UI**: Custom CSS design system with luminous gradients, glowing borders, dark mode aesthetic, and fluid micro-animations.

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/cards/overview-cards.svg" alt="Overview Cards" width="100%" />
</p>

---

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/headers/header-personas.svg" alt="User Personas Header" width="100%" />
</p>

## 👥 Dual User Experience

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/cards/personas-cards.svg" alt="Recruiter & Candidate Personas" width="100%" />
</p>

---

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/headers/header-architecture.svg" alt="Architecture Header" width="100%" />
</p>

## 🏛 System Architecture & Interview Sequence

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/workflow.svg" alt="System Workflow Diagram" width="100%" />
</p>

```mermaid
sequenceDiagram
    autonumber
    actor Recruiter
    participant Frontend as ⚛️ React 19 SPA (:5173)
    participant Backend as ⚡ Flask Server (:5000)
    participant Database as 💾 SQLite DB
    participant Email as 📧 SMTP Service

    Recruiter->>Frontend: Select candidate & Click "Schedule Interview"
    Frontend->>Frontend: Open scheduling modal (Date, Time, Video Link)
    Frontend->>Backend: POST /api/applications/<id>/interview
    Backend->>Database: Update status to "Interview Scheduled"
    Backend->>Email: Dispatch branded HTML interview invitation
    Email-->>Recruiter: Email delivered to candidate
    Backend-->>Frontend: HTTP 200 OK + Updated Pipeline Data
    Frontend-->>Recruiter: UI re-renders with success notification
```

---

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/headers/header-quickstart.svg" alt="Quickstart Header" width="100%" />
</p>

## ⚡ How to Run the Frontend Locally

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/cards/terminal-quickstart.svg" alt="Animated Terminal Quickstart" width="100%" />
</p>

---

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/cards/author-footer.svg" alt="Created by Nived Reddy" width="100%" />
</p>

<p align="center">
  <a href="https://github.com/Nivedreddy6"><img src="https://img.shields.io/badge/GitHub-Follow%20%40Nivedreddy6-181717?style=for-the-badge&logo=github&logoColor=white" alt="Follow on GitHub" /></a>
  <a href="https://github.com/Nivedreddy6/Flask"><img src="https://img.shields.io/badge/Star%20Repo-⭐%20GitHub-FFD700?style=for-the-badge&logo=github&logoColor=black" alt="Star on GitHub" /></a>
  <a href="https://github.com/Nivedreddy6/Flask/fork"><img src="https://img.shields.io/badge/Fork%20Repo-🍴%20Contribute-2ea44f?style=for-the-badge&logo=github&logoColor=white" alt="Fork on GitHub" /></a>
</p>

<div align="center">
  <b>Job Sphere Studio</b> • Developed with ❤️ by <a href="https://github.com/Nivedreddy6"><b>Nived Reddy (@Nivedreddy6)</b></a>
</div>
