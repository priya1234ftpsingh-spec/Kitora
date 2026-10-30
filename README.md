# AI-Driven Training, Placement & Career Development Management System

**Subtitle:** A Web-Based Training & Placement Cell Management Platform  
**Target Program:** BCA III Year / V Semester Academic Capstone Project  
**Architecture:** Modern MERN (MongoDB, Express.js, React.js, Node.js) with AI Career Advisory Layer

---

## 🌟 Executive Overview

The **AI-Driven Training, Placement & Career Development Management System** is a production-style SaaS platform engineered to replace outdated college placement spreadsheets and paperwork. It provides a single centralized portal connecting students, the Training & Placement Officer (TPO), and recruiting partners with automated eligibility screening, interview pipelines, marksheet verification, and AI-driven career guidance.

---

## 🚀 Key Functional Modules

### 👨‍🎓 1. Student Portal
- **Dashboard:** Welcome header with profile completion %, active applications count, scheduled interviews, and document audit status.
- **Academic & Portfolio Profile:** Complete management of personal info, degree details (BCA), semester-by-semester SGPA, overall CGPA, active backlogs, technical/soft skills, project portfolio (with GitHub/live links), internships, and certifications.
- **Document Management:** Upload, inspect, and track verification status of 10th marksheets, 12th marksheets, college grade cards, resumes, and certificates.
- **Resume Management & AI Audit:** Instant ATS-style quality evaluation displaying score out of 100, detected skill matrices, missing resume sections, and actionable improvement tips.
- **Placement Drives:** Browse visiting drives with live deadline counters. Automated eligibility engine calculates whether the student qualifies based on CGPA, degree branch, and backlogs.
- **Applications Tracking:** Graphic timeline tracker tracing `Applied → Shortlisted → Interview Scheduled → Selected / Rejected`.
- **Interview Schedule:** View upcoming technical and HR rounds, evaluator names, online meeting URLs (Google Meet / Teams), and candidate instructions.
- **Training & Bootcamps:** View scheduled placement preparation modules, download course materials, and register with one click.
- **Seminars & Workshops:** Browse guest lectures and technology conclaves (separated from recruitment drives) with RSVP tracking.
- **AI Career Copilot:** Interactive conversational assistant answering technical interview questions, explaining the STAR technique, and recommending 4-week preparation sequences.
- **AI Skill-Gap Analysis:** Benchmark registered skills against industry career roles (Full Stack Developer, Data Analyst, Cloud Engineer) with step-by-step learning roadmaps.

### 🏛️ 2. Training & Placement Officer (TPO) Command Center
- **Executive Dashboard:** Macro analytics featuring application funnels, departmental placement percentages, and compensation brackets (<4 LPA to >10 LPA).
- **Students Directory:** Searchable and filterable student roster with filters for Branch, Batch, CGPA thresholds, and Placement Status.
- **Student Profile Inspector:** Full audit of student academic records, verification of uploaded documents, and manual placement status overrides.
- **Document Verification Queue:** Approve or reject student marksheets with mandatory rejection reasons and instant push notifications.
- **Corporate Partner Management:** Register visiting company recruiters, office hubs, and website links.
- **Placement Drive Governance:** Create and publish drives with strict eligibility gates (minimum CGPA, max backlogs, allowed graduation years, required skills).
- **Candidate Pipeline:** Review applicants, filter by drive, shortlist qualified profiles, schedule interview rounds, and record final offers.
- **Interview Management:** Reschedule or update results (Passed / Failed) with automated alerts sent to students.
- **Training & Seminars Management:** Schedule bootcamps and guest workshops, upload curriculums, and monitor student attendance.
- **Campus Notice Board:** Publish high-priority notices, policy memos, and placement circulars.
- **Notifications Dispatcher:** Send targeted notifications to specific student batches or campus-wide.
- **Export & Reports:** Tabular placed students roster and recruitment yield summaries with one-click CSV export and print-ready stylesheets.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router 6, Tailwind CSS, Lucide React, Recharts, Axios |
| **Backend** | Node.js (ES Modules), Express.js, JWT, Bcrypt.js, Multer |
| **Database** | MongoDB, Mongoose ORM |
| **AI Layer** | Deep heuristics & skill taxonomy engine + Dynamic advisory layer |

---

## 🔑 Pre-Seeded Demo Credentials

The database comes pre-seeded with realistic academic data:

| Portal Role | Email / Login ID | Password | Account Details |
| :--- | :--- | :--- | :--- |
| **TPO Officer** | `tpo@college.edu` | `Admin@123` | Dr. Rajesh Sharma (Head - TPO) |
| **Demo Student** | `rohit.sharma@student.edu` (or `BCA2024001`) | `Student@123` | Rohit Sharma (BCA Final Year, 8.4 CGPA) |
| **Placed Student** | `priya.patel@student.edu` (or `BCA2024002`) | `Student@123` | Priya Patel (Placed at DataVerve, 7.2 LPA) |

*(Quick autofill buttons are built directly into the login screens for convenient evaluation).*

---

## ⚙️ Quick Start Installation & Execution

### 1. Prerequisites
- Node.js (v18+)
- MongoDB running locally on `mongodb://127.0.0.1:27017`

### 2. Database Seeding
From the `backend` folder:
```bash
npm run seed
```

### 3. Start Backend Server
```bash
cd backend
npm run dev
# Running on http://localhost:5000
```

### 4. Start Frontend Client
```bash
cd frontend
npm run dev
# Running on http://localhost:5173
```

---

## 📑 Advisory Disclaimer
> **Notice:** AI skill gap suggestions, resume quality ratings, and career recommendations are generated for developmental and advisory purposes only. They do not represent official recruiter hiring guarantees or institutional selection decisions.
