# Aura — Habit Planner & Personal Growth Platform

A modern, full-stack personal operating system designed to help users build discipline, track daily routines, visualize consistency streaks, and optimize personal productivity.

Built with **React 19**, **Vite**, **Tailwind CSS v4**, **Node.js**, **Express**, and **MongoDB / Mongoose**.

---

## 🌟 Key Features

### 1. Core Habit Engine
- **Atomic Daily Check-Ins**: Sub-millisecond optimistic UI toggle response with database persistence.
- **Inline Title Editing**: Quick editing directly on habit cards without page refreshes.
- **Categorization**: Multi-category tagging (Personal Growth, Health, Fitness, Skills, Mindfulness).
- **Timezone-Safe Tracking**: Dates formatted as uniform `YYYY-MM-DD` strings to eliminate timezone drift.

### 2. Intelligent Streak Engine
- **Rest-Day Tolerance**: Custom scheduling (e.g., Monday–Friday habits) preserves streaks over non-scheduled rest days without breaking counters.
- **Same-Day Grace Period**: Tracks in-progress days accurately without premature resets.
- **Current & Longest Streak**: Tracks personal bests alongside active momentum.

### 3. Visual Analytics & Gamification
- **LeetCode-Style Streak Milestones**: Multi-tier progress bar visualizes discipline progression (Spark ➔ Bronze ➔ Silver ➔ Gold Master).
- **GitHub-Style Contribution Heatmap**: 365-day visual density grid mapping daily check-in volume.
- **7-Day Velocity Chart**: Daily completion percentage bar charts across scheduled routines.
- **Daily Performance Ring**: Dynamic SVG score gauge calculating overall daily accountability.

### 4. Productivity Suite
- **Interactive Growth Calendar**: Dynamic month navigation with day-by-day cross-module log breakdown.
- **Today's Action Items**: Integrated action checklist with category filtering and instant toggles.
- **Milestone Goal Tracker**: Long-term goals with sub-milestones and auto-computed progress percentages.
- **Mindset Banner**: "Thought of the Day" popup and active mindset quote display.

### 5. Resilient Architecture
- **Dual-Mode Persistence**: Seamlessly works out-of-the-box in **Autonomous Dev Mode** (in-memory store with seeded data) if MongoDB Community Server is not running locally, or connects directly to local/Atlas MongoDB when configured.
- **JWT Authentication**: Secure bcrypt password hashing, token issuance, and protected private routes.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, React Router v7, Lucide Icons, Axios |
| **Backend** | Node.js, Express.js (ES Modules), JSON Web Tokens (JWT), Bcrypt.js, Morgan |
| **Database** | MongoDB, Mongoose ODM (with in-memory dev fallback) |
| **Styling** | Modern Dark Zinc Aesthetic (`#09090b`), Glassmorphism, Micro-animations |

---

## 📁 Project Architecture

```
Habbit_Planner/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB connection with zero-buffer timeout
│   │   ├── controllers/     # Request handlers (auth, habits, analytics, tasks, goals)
│   │   ├── middleware/      # JWT auth guard (`protect`) & centralized error handler
│   │   ├── models/          # Mongoose schemas (User, Habit, HabitCompletion, Task, Goal)
│   │   ├── routes/          # REST route definitions
│   │   ├── services/        # Streak calculation engine & devMemoryStore
│   │   ├── utils/           # JWT token generator
│   │   ├── app.js           # Express app setup and middleware
│   │   └── server.js        # Server listener
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # HabitCard, Heatmap, Topbar, Sidebar, MotivationModal
│   │   ├── context/         # AuthContext & AppContext
│   │   ├── pages/           # Dashboard, Habits, Calendar, Progress, Food, Fitness, Login, Register
│   │   ├── services/        # Axios API clients (api, habitService, analyticsService, taskService)
│   │   ├── layouts/         # MainLayout with collapsible hover navigation
│   │   ├── data/            # Initial datasets
│   │   ├── App.jsx          # Route hierarchy with ProtectedRoute guards
│   │   └── main.jsx         # App entrypoint
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- *(Optional)* **MongoDB** (Local Community Server or MongoDB Atlas connection string)

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```
The backend API server starts at `http://localhost:5000`.

> **Note on MongoDB**: If MongoDB is not installed locally, the server automatically boots into **Autonomous Dev Mode** with pre-seeded demo accounts and data so you can test immediately without setup errors.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The React development server launches at `http://localhost:5173`.

---

## 🔑 Demo Credentials

To test the application instantly:
- Click the **"Instant One-Click Demo Access"** button on the Login page, or use:
  - **Email**: `demo@habits.local`
  - **Password**: `secret123`

---

## 📡 REST API Reference

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Authenticate user & get JWT | Public |
| `GET` | `/api/auth/me` | Fetch active user profile | Private |
| `GET` | `/api/habits` | Retrieve all active habits with streaks | Private |
| `POST` | `/api/habits` | Create a new habit | Private |
| `PUT` | `/api/habits/:id` | Update habit metadata or schedule | Private |
| `DELETE` | `/api/habits/:id` | Delete habit & cascade completion logs | Private |
| `POST` | `/api/habits/:id/toggle` | Check in or unmark habit for a date | Private |
| `GET` | `/api/habits/daily-progress` | Daily completion percentage for today | Private |
| `GET` | `/api/analytics/summary` | Overall habit & streak statistics | Private |
| `GET` | `/api/analytics/weekly` | 7-day completion velocity trend | Private |
| `GET` | `/api/analytics/heatmap` | 365-day activity count map | Private |
| `GET` | `/api/tasks` | Retrieve scheduled action items | Private |
| `POST` | `/api/tasks` | Create a new action item | Private |
| `POST` | `/api/tasks/:id/toggle` | Toggle task completion status | Private |
| `GET` | `/api/goals` | List long-term goals with milestones | Private |
| `POST` | `/api/goals` | Create a new goal | Private |

---

## 🔒 Security & Data Hygiene
- **No Plaintext Passwords**: Automatic salting and hashing via `bcryptjs`.
- **Query Protection**: Passwords set to `select: false` by default in Mongoose schemas.
- **User Isolation**: All database queries strictly scope records by `userId: req.user._id`.
- **Token Verification**: Custom `protect` middleware ensures unauthorized requests receive standard `401 Unauthorized`.
