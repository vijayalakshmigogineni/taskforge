# 📝 TaskForge - Full Stack Todo Management Application

A modern full-stack Todo Management Application built with React, TypeScript, Express, Prisma, PostgreSQL, and JWT Authentication.

The application allows users to securely register, log in, manage personal tasks, set priorities, search todos, filter by status, and track completion progress.

---

## 🚀 Features

### Authentication

* User Registration
* User Login
* JWT-Based Authentication
* Protected Routes
* Password Reset

### Todo Management

* Create Todos
* Update Todos
* Delete Todos
* Mark Todos as Complete
* Priority Levels:

  * LOW
  * MEDIUM
  * HIGH

### Search & Filtering

* Search Todos by Title
* Filter by Completion Status
* Filter by Priority
* Pagination Support

### Security

* Password Hashing using bcrypt
* JWT Authentication
* Protected API Routes
* CORS Configuration

---

## 🏗️ Tech Stack

### Frontend

* React 19
* TypeScript
* Vite
* Tailwind CSS
* Radix UI

### Backend

* Node.js
* Express.js
* TypeScript
* Prisma ORM

### Database

* PostgreSQL
* Neon Database

### Authentication

* JWT (JSON Web Tokens)
* bcryptjs

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: Neon

---

## 📁 Project Structure

```text
todo-application/
│
├── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   └── utils/
│   └── app.ts
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── App.tsx
│   │   └── main.tsx
│
└── README.md
```

---

## ⚙️ Environment Variables

### Backend (.env)

```env
DATABASE_URL=your_neon_database_url
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
PORT=5000
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🔧 Local Setup

### Clone Repository

```bash
git clone <repository-url>
cd todo-application
```

---

## Backend Setup

```bash
cd backend

npm install
```

Create:

```env
backend/.env
```

Run Prisma:

```bash
npx prisma generate
npx prisma db push
```

Start Backend:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

---

## Frontend Setup

```bash
cd frontend

npm install
```

Create:

```env
frontend/.env
```

```env
VITE_API_URL=http://localhost:5000/api
```

Start Frontend:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/reset-password
```

### Todos

```http
GET    /api/todos
POST   /api/todos
PUT    /api/todos/:id
DELETE /api/todos/:id
```

---

## Deployment Architecture

```text
React Frontend (Vercel)
           │
           ▼
Node.js + Express API (Render)
           │
           ▼
PostgreSQL Database (Neon)
```

---

## Future Enhancements

* Refresh Tokens
* Email Verification
* Forgot Password via Email
* Dark Mode
* Due Dates
* Categories & Tags
* Dashboard Analytics
* Team Collaboration

---

## Author

Built using:

* React
* TypeScript
* Node.js
* Express
* Prisma
* PostgreSQL
* JWT Authentication
