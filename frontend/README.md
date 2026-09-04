<p align="center">
  <img src="public/banner.svg" alt="Job Sphere Studio Banner" width="100%" />
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
  <img src="public/headers/header-overview.svg" alt="Overview Header" width="100%" />
</p>

> [!IMPORTANT]
> The **Job Sphere Studio Frontend** is an ultra-modern Single Page Application (SPA) designed to deliver a high-velocity recruitment experience with instant applicant status transitions, dynamic filtering, interactive interview modals, and real-time backend sync.

<p align="center">
  <img src="public/cards/overview-cards.svg" alt="Overview Cards" width="100%" />
</p>

---

<p align="center">
  <img src="public/headers/header-personas.svg" alt="User Personas Header" width="100%" />
</p>

<p align="center">
  <img src="public/cards/personas-cards.svg" alt="Recruiter & Candidate Personas" width="100%" />
</p>

---

<p align="center">
  <img src="public/headers/header-architecture.svg" alt="Architecture Header" width="100%" />
</p>

<p align="center">
  <img src="public/workflow.svg" alt="System Workflow Diagram" width="100%" />
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
  <img src="public/headers/header-quickstart.svg" alt="Quickstart Header" width="100%" />
</p>

### 1️⃣ Install Dependencies
```bash
cd frontend
npm install
```

### 2️⃣ Run Development Server
```bash
npm run dev
```

> 🌐 Frontend SPA: **http://localhost:5173** (Proxies `/api` to `http://127.0.0.1:5000`)

---

<p align="center">
  <b>Job Sphere Studio</b> • Built with modern engineering and designed to elevate careers.
</p>
