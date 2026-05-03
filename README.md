# 🚀 JobPortal Frontend

A modern, full-featured **Job Portal Web Application** built with React 19, Vite, and Tailwind CSS — fully integrated with a Spring Boot backend.

---

## 📸 Overview

JobPortal is a production-ready frontend application that connects job seekers with top employers. It features role-based dashboards, real-time job listings, one-click apply, company discovery, and a seamless authentication flow.

---

## ✨ Features

### 👤 Authentication
- Login & Register in a single unified page with tab toggle
- Role-based routing — **Job Seekers** and **Recruiters** land on separate dashboards
- JWT token stored in `localStorage` for persistent sessions
- Secure API calls with `Authorization: Bearer <token>` headers

### 🧑‍💻 Job Seeker
- **Dashboard** — stats overview (applications sent, profile views, saved jobs, interviews)
- **Browse Jobs** — fetches live listings from Spring Boot API with skeleton loading states
- **One-Click Apply** — apply directly from job cards with instant feedback
- **My Profile** — view personal info, skills with proficiency levels
- **Recent Applications** — track application statuses in real time

### 🏢 Recruiter
- **Recruiter Dashboard** — active job posts, total applicants, shortlisted candidates
- **Applicant Management** — view recent applicants with status badges
- **Active Job Posts** — manage live listings with applicant counts
- **Post New Job** button (UI ready for backend integration)

### 🌐 Public Pages
- **Home Page** — hero section, stats bar, feature highlights, CTA banner
- **Job Listings** — paginated job cards with type/salary/location details
- **Companies** — grid of company cards with location and "View Jobs" CTA
- **Search Bar** — job title + location search component
- **404 Page** — clean not-found page with back-to-home navigation

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19.x | UI Library |
| Vite | 8.x | Build Tool & Dev Server |
| Tailwind CSS | 4.x | Utility-first Styling |
| React Router DOM | 7.x | Client-side Routing |
| Axios | 1.x | HTTP Client |
| React Hook Form | 7.x | Form Handling |
| Font Awesome | 7.x | Icons |

---

## 📁 Project Structure

```
job-portal-frontend/
├── public/
├── src/
│   ├── pages/
│   │   ├── HomePage.jsx          # Landing page with hero, stats, features
│   │   ├── AuthPage.jsx          # Login / Register with JWT handling
│   │   ├── JobList.jsx           # Live job listings from API
│   │   └── UserProfile.jsx       # Job seeker profile view
│   │
│   ├── components/
│   │   ├── Navbar.jsx            # Sticky top navigation bar
│   │   ├── JobCard.jsx           # Job listing card with apply button
│   │   ├── CompanyCard.jsx       # Company display card
│   │   ├── Companies.jsx         # Companies grid page
│   │   ├── Search.jsx            # Search bar component
│   │   ├── ProfileCard.jsx       # Reusable profile field card
│   │   ├── Jobseekerdashboard.jsx # Job seeker dashboard
│   │   ├── Employerdashboard.jsx  # Recruiter dashboard
│   │   └── PageNotFound.jsx      # 404 page
│   │
│   ├── hooks/
│   │   └── useApi.jsx            # Custom hook for API calls (GET/POST/PUT/DELETE)
│   │
│   ├── App.jsx                   # Route definitions
│   ├── main.jsx                  # App entry point with BrowserRouter
│   └── index.css                 # Global styles + Tailwind import
│
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

## 🔌 API Integration

The app communicates with a **Spring Boot backend** running on `http://localhost:8080`.

| Endpoint | Method | Description |
|---|---|---|
| `/api/v1/auth/login` | POST | User login, returns JWT |
| `/api/v1/auth/register` | POST | New user registration |
| `/api/v1/jobs?page=0&size=10` | GET | Paginated job listings |
| `/api/v1/applications/{jobId}/apply` | POST | Apply to a job |

### Custom `useApi` Hook

A reusable hook handles all API communication:

```js
const { data, loading, error, post, get, put, del } = useApi();

// Example usage
const response = await post("http://localhost:8080/api/v1/auth/login", payload);
```

- Auto-attaches JWT token from `localStorage`
- Handles loading and error states
- Supports GET, POST, PUT, DELETE

---

## ⚙️ Getting Started

### Prerequisites
- Node.js >= 20.x
- Spring Boot backend running on port `8080`

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/job-portal-frontend.git
cd job-portal-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

App will be available at **http://localhost:5173**

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🔐 Authentication Flow

```
User submits Login/Register form
        ↓
POST /api/v1/auth/login or /register
        ↓
Backend returns { token, role }
        ↓
Token & role saved to localStorage
        ↓
Role === "RECRUITER"  →  /dashboard/recruiter
Role === "JOBSEEKER"  →  /dashboard/jobseeker
```

---

## 🗺️ Routes

| Path | Component | Access |
|---|---|---|
| `/` | HomePage | Public |
| `/home` | HomePage | Public |
| `/auth` | AuthPage | Public |
| `/Jobs` | JobList | Public |
| `/companies` | Companies | Public |
| `/me` | UserProfile | Authenticated |
| `/dashboard/jobseeker` | JobSeekerDashboard | Job Seeker |
| `/dashboard/recruiter` | RecruiterDashboard | Recruiter |
| `/*` | PageNotFound | Public |

---

## 🎨 Design System

The UI follows a consistent design language throughout:

- **Primary Color:** `#2563eb` (Blue 600)
- **Dark Background:** `#0f172a` (Slate 900)
- **Accent:** `#7c3aed` (Violet 700) — used for recruiter flows
- **Font:** `DM Sans` (body) + `Syne` (headings)
- **Border Radius:** `10px–24px` for a modern card-based layout
- **Hover Effects:** `translateY(-2px)` lift + shadow on interactive elements

---

## 📦 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint checks |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Saurabh Kawatra**  
Java Backend Developer | React Enthusiast  
📧 saurabhkawatra2001@gmail.com

---

> Built with ❤️ using React 19 + Vite + Spring Boot