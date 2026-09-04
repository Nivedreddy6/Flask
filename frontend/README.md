<p align="center">
  <img src="public/banner.svg" alt="Job Sphere Studio Banner" width="100%" />
</p>

<p align="center">
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" /></a>
  <a href="https://vite.dev/"><img src="https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" /></a>
  <a href="https://flask.palletsprojects.com/"><img src="https://img.shields.io/badge/Flask-3.0-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask" /></a>
  <a href="https://oxc.rs/"><img src="https://img.shields.io/badge/Linter-Oxlint-F27244?style=for-the-badge&logo=rust&logoColor=white" alt="Oxlint" /></a>
  <a href="https://lucide.dev/"><img src="https://img.shields.io/badge/Icons-Lucide%20React-F56565?style=for-the-badge" alt="Lucide React" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Status-Active%20%E2%9C%94-00C853?style=for-the-badge" alt="Status Active" /></a>
</p>

---

<p align="center">
  <img src="public/headers/header-overview.svg" alt="Overview Header" width="100%" />
</p>

> [!IMPORTANT]
> The **Job Sphere Studio Frontend** is an ultra-modern Single Page Application (SPA) designed to deliver a high-velocity recruitment experience with instant applicant status transitions, dynamic filtering, interactive interview modals, and real-time backend sync.

<table>
  <tr>
    <td width="50%" bgcolor="#0f172a">
      <h3 style="color:#818cf8;">💼 Recruiter Command Center</h3>
      <ul style="color:#cbd5e1;">
        <li>📊 <b>Real-time Metrics Dashboard</b>: Active job counts, review queues, shortlist rates.</li>
        <li>📑 <b>ATS Candidate Board</b>: Multi-stage applicant management with 1-click status transitions.</li>
        <li>📅 <b>Automated Interview Scheduling</b>: Meeting links and date/time selector with email triggers.</li>
      </ul>
    </td>
    <td width="50%" bgcolor="#1e1b4b">
      <h3 style="color:#c084fc;">🚀 Candidate Career Experience</h3>
      <ul style="color:#cbd5e1;">
        <li>🔍 <b>Smart Discovery</b>: Filter opportunities by title, salary bracket, and tech stack.</li>
        <li>⚡ <b>1-Click Apply</b>: Upload resumes with instant file validation.</li>
        <li>📬 <b>Live Status Stepper</b>: Visual multi-step progress tracking.</li>
      </ul>
    </td>
  </tr>
</table>

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
