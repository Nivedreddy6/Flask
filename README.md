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

> [!IMPORTANT]
> **Job Sphere Studio** is an enterprise-ready, full-stack recruitment platform and automated Applicant Tracking System (ATS). It bridges top tech talent with innovative employers through automated screening pipelines, real-time candidate metrics, and instant email interview dispatching.

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/cards/overview-cards.svg" alt="Overview Cards" width="100%" />
</p>

---

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/headers/header-features.svg" alt="Features Header" width="100%" />
</p>

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
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/cards/pipeline-stepper.svg" alt="Hiring Pipeline Stages" width="100%" />
</p>

---

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/headers/header-personas.svg" alt="User Personas Header" width="100%" />
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/cards/personas-cards.svg" alt="Recruiter & Candidate Personas" width="100%" />
</p>

---

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/headers/header-architecture.svg" alt="System Architecture Header" width="100%" />
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/workflow.svg" alt="Workflow Pipeline Architecture" width="100%" />
</p>

```mermaid
flowchart TD
    subgraph Frontend [⚛️ React 19 Frontend SPA :5173]
        UI[🎨 Glassmorphism UI]
        Router[🛣️ React Router SPA]
        Components[🧩 Candidate & ATS Tables]
    end

    subgraph Backend [⚡ Flask 3.0 Backend :5000]
        API[🔌 REST Controllers]
        Auth[🔒 Session & Werkzeug Security]
        Mailer[📧 SMTP Email Service]
    end

    subgraph Storage [💾 Data & Assets Layer]
        DB[(🗄️ SQLite Database)]
        Uploads[📁 Secure Resume Vault]
    end

    UI --> Router
    Router --> Components
    Components -->|Proxy /api| API
    API --> Auth
    API --> Mailer
    API --> DB
    API --> Uploads
```

---

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/headers/header-datamodel.svg" alt="Data Model Header" width="100%" />
</p>

```mermaid
erDiagram
    USER ||--o{ USER_PROFILE : has
    USER ||--o{ COMPANY_PROFILE : owns
    USER ||--o{ JOB_POSTING : creates
    USER ||--o{ APPLICATION : submits
    USER ||--o{ NOTIFICATION : receives
    JOB_POSTING ||--o{ APPLICATION : receives

    USER {
        int id PK
        string email
        string password_hash
        string role "seeker | recruiter"
    }

    JOB_POSTING {
        int id PK
        int recruiter_id FK
        string title
        string salary_range
        string status "Active | Closed"
    }

    APPLICATION {
        int id PK
        int job_id FK
        int seeker_id FK
        string status "Applied | Shortlisted | Scheduled | Hired"
        string resume_filename
    }
```

---

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/headers/header-api.svg" alt="API Specification Header" width="100%" />
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/cards/api-endpoints.svg" alt="REST API Endpoints Specification" width="100%" />
</p>

---

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/headers/header-quickstart.svg" alt="Quickstart Header" width="100%" />
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Nivedreddy6/Flask/main/frontend/public/cards/terminal-quickstart.svg" alt="Animated Terminal Quickstart" width="100%" />
</p>

---

<div align="center">
  <h3>✨ Job Sphere Studio — Engineering Tomorrow's Hiring Infrastructure ✨</h3>
</div>
