<p align="center">
  <img src="./public/banner.svg" alt="Job Sphere Studio Banner" width="100%" />
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

<div align="center">

# ⚛️ Job Sphere Studio — React 19 Frontend SPA

### 🌟 *An Ultra-Modern, Glassmorphic Recruitment UI Built with React 19, Vite 8, and Real-Time Backend Proxy.*

[📖 What is This Project?](#-what-is-this-project) • [✨ Core UI Capabilities](#-core-ui-capabilities) • [🏛 Architecture & Workflow](#-system-architecture--workflow) • [📂 Component Architecture](#-component-architecture) • [⚡ Quickstart](#-quick-start) • [📜 Scripts](#-available-scripts) • [⚙️ Proxy Config](#%EF%B8%8F-proxy--network-configuration)

</div>

---

## 📖 What is This Project?

The **Job Sphere Studio Frontend** is a Single Page Application (SPA) providing an interactive recruitment interface. It connects to the Flask API backend to deliver a recruitment experience with:

* 📊 **Recruiter Command Center**: Instant metric tracking for active jobs, candidate submissions, shortlist rates, and interview pipelines.
* 📋 **Interactive ATS Candidate Table**: Filterable and searchable applicant management table with instantaneous status updates and resume inspection.
* 📅 **Smart Interview Modal**: Integrated modal for setting interview dates, times, video conferencing links, and custom candidate notes with automated email triggers.
* 🎨 **Bespoke Glassmorphism Design**: Tailored CSS design system featuring backdrop blur filters, glowing gradient borders, responsive layouts, and fluid micro-animations.

---

## ✨ Core UI Capabilities

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>💼 Recruiter Pipeline Suite</h3>
      <ul>
        <li>📊 <b>Real-time Metrics Dashboard:</b> Monitor active job counts, pending candidate reviews, shortlisted talent, and confirmed interviews.</li>
        <li>📑 <b>Applicant Tracking Board:</b> Fast multi-stage candidate management with one-click status transitions.</li>
        <li>📅 <b>Interview Scheduling:</b> Automated scheduling modal with instant calendar & email alerts.</li>
        <li>📈 <b>Interactive Analytics:</b> Visual status breakdowns, conversion rates, and hiring pipeline heatmaps.</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <h3>🚀 Candidate Experience Portal</h3>
      <ul>
        <li>🔍 <b>Smart Discovery:</b> Search and filter opportunities by title, compensation tier, and tech stack.</li>
        <li>⚡ <b>1-Click Application:</b> Submit resumes (PDF/DOCX) with immediate validation.</li>
        <li>📬 <b>Live Status Tracking:</b> Visual multi-step progress bar showing real-time application updates.</li>
        <li>🔔 <b>In-App Notifications:</b> Instant alerts when recruiters review, shortlist, or schedule interviews.</li>
      </ul>
    </td>
  </tr>
</table>

---

## 🏛 System Architecture & Workflow

<p align="center">
  <img src="./public/workflow.svg" alt="System Workflow Diagram" width="100%" />
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

## 📂 Component Architecture

```text
frontend/src/
├── components/
│   ├── AnalyticsDashboard.jsx   # Top metric summary cards & KPIs
│   ├── ApplicationsTable.jsx    # Interactive ATS candidate management table
│   ├── Navbar.jsx               # Responsive header navigation & user avatar
│   └── TopBanner.jsx            # Announcement banner with quick actions
├── pages/
│   ├── ApplicationsPage.jsx     # Full-page applicant tracking view
│   └── DashboardPage.jsx        # Consolidated analytics and overview
├── App.jsx                      # Client router and layout wrapper
├── index.css                    # Glassmorphism tokens, gradients, animations
└── main.jsx                     # React 19 DOM mount root
```

---

## 🚀 Quick Start

### 1️⃣ Install Dependencies
```bash
cd frontend
npm install
```

### 2️⃣ Start Development Server
```bash
npm run dev
```

Your React client will be available at:
👉 **[http://localhost:5173](http://localhost:5173)**

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Spawns the local Vite HMR server on port `5173` |
| `npm run build` | Compiles and optimizes assets into production `/dist` bundle |
| `npm run preview` | Runs a local web server to preview the production build |
| `npm run lint` | Blazing-fast linting powered by [Oxlint](https://oxc.rs) |

---

## ⚙️ Proxy & Network Configuration

The frontend communicates with the Flask backend running on port `5000` via Vite's automated reverse proxy configured in `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
```

---

<p align="center">
  <b>Job Sphere Studio</b> • Built with modern engineering and designed to elevate careers.
</p>
