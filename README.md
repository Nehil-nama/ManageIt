# 🚀 WorkPulse — Team & Project Management App

A full-stack project management platform built with React.js, Node.js, MongoDB, and Tailwind CSS.

---

## 📁 Project Structure

```
workpulse/
├── client/                  # React.js Frontend
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── layout/      # Sidebar, Navbar, PageWrapper
│       │   ├── ui/          # Buttons, Cards, Badges, Avatars
│       │   ├── modals/      # Create Project/Task/Team modals
│       │   └── charts/      # Priority chart, Status chart
│       ├── pages/
│       │   ├── Dashboard/   # Overview stats + recent activity
│       │   ├── Projects/    # All projects list + detail view
│       │   ├── Tasks/       # Kanban board + task list
│       │   ├── Teams/       # Team members management
│       │   ├── Timeline/    # Gantt-style timeline view
│       │   ├── Settings/    # User/App settings
│       │   └── Auth/        # Login & Register
│       ├── context/         # AuthContext, ThemeContext
│       ├── hooks/           # Custom hooks (useFetch, useAuth)
│       └── utils/           # API helper, date utils, constants
│
└── server/                  # Node.js + Express Backend
    └── src/
        ├── config/          # DB connection, env config
        ├── controllers/     # Business logic per resource
        ├── models/          # Mongoose schemas
        ├── routes/          # Express route definitions
        ├── middleware/       # Auth JWT, error handler
        └── utils/           # Helpers, token utils
```

---

## ⚙️ Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- MongoDB Atlas account (free) OR MongoDB installed locally

---

## 🛠️ Installation

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/workpulse.git
cd workpulse
```

### 2. Setup the Server
```bash
cd server
npm install
cp .env.example .env
# Fill in your .env values (MongoDB URI, JWT secret, port)
```

### 3. Setup the Client
```bash
cd ../client
npm install
cp .env.example .env
# Fill in REACT_APP_API_URL
```

---

## ▶️ Running Locally (Development)

### Start Backend (from /server)
```bash
npm run dev
# Runs on http://localhost:5000
```

### Start Frontend (from /client)
```bash
npm start
# Runs on http://localhost:3000
```

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint             | Description        |
|--------|----------------------|--------------------|
| POST   | /api/auth/register   | Register new user  |
| POST   | /api/auth/login      | Login user         |
| GET    | /api/auth/me         | Get current user   |

### Projects
| Method | Endpoint              | Description          |
|--------|-----------------------|----------------------|
| GET    | /api/projects         | Get all projects     |
| POST   | /api/projects         | Create project       |
| GET    | /api/projects/:id     | Get project by ID    |
| PUT    | /api/projects/:id     | Update project       |
| DELETE | /api/projects/:id     | Delete project       |

### Tasks
| Method | Endpoint              | Description          |
|--------|-----------------------|----------------------|
| GET    | /api/tasks            | Get all tasks        |
| POST   | /api/tasks            | Create task          |
| GET    | /api/tasks/:id        | Get task by ID       |
| PUT    | /api/tasks/:id        | Update task          |
| DELETE | /api/tasks/:id        | Delete task          |
| PATCH  | /api/tasks/:id/status | Update task status   |

### Teams
| Method | Endpoint              | Description          |
|--------|-----------------------|----------------------|
| GET    | /api/teams            | Get all teams        |
| POST   | /api/teams            | Create team          |
| GET    | /api/teams/:id        | Get team by ID       |
| PUT    | /api/teams/:id        | Update team          |
| DELETE | /api/teams/:id        | Delete team          |

### Users
| Method | Endpoint              | Description          |
|--------|-----------------------|----------------------|
| GET    | /api/users            | Get all users        |
| GET    | /api/users/:id        | Get user by ID       |
| PUT    | /api/users/:id        | Update user profile  |

---

## 🚀 Deployment

### Backend → Render.com (Free)
1. Push your code to GitHub
2. Go to https://render.com → New Web Service
3. Connect your repo → choose `/server` as root
4. Set Build Command: `npm install`
5. Set Start Command: `node src/index.js`
6. Add Environment Variables from `.env`
7. Deploy!

### Frontend → Vercel (Free)
1. Go to https://vercel.com → New Project
2. Connect your GitHub repo → choose `/client` as root
3. Set `REACT_APP_API_URL` to your Render backend URL
4. Deploy!

### Database → MongoDB Atlas (Free)
1. Go to https://cloud.mongodb.com
2. Create a free M0 cluster
3. Create a DB user + whitelist IP `0.0.0.0/0`
4. Copy the connection string into your server `.env`

---

## 🔑 Environment Variables

### server/.env
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/workpulse
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### client/.env
```
REACT_APP_API_URL=http://localhost:5000/api
```
