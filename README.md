# 🚀 TaskForge

A full-stack task management application built with React, TypeScript, Express.js, Prisma, PostgreSQL, and JWT Authentication.

## 🌐 Live Demo

Frontend:
https://taskforge-gray-ten.vercel.app/

Backend:
https://taskforge-ox12.onrender.com

---

## ✨ Features

- User Registration
- User Login
- JWT Authentication
- Create Todo
- Update Todo
- Delete Todo
- Search Todos
- Filter by Priority
- PostgreSQL Database
- Responsive UI

---

## 🛠 Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- JWT Authentication

### Database
- PostgreSQL (Neon)

### Deployment
- Vercel (Frontend)
- Render (Backend)

---

## 📦 Run Locally

### 1. Fork Repository

Click the Fork button on GitHub.

### 2. Clone Repository

```bash
git clone https://github.com/<your-username>/taskforge.git
cd taskforge
```

---

## 🔧 Backend Setup

Navigate to backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create `.env` file:

```env
DATABASE_URL=your_neon_database_url
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

Generate Prisma Client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate deploy
```

Start backend:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

---

## 🎨 Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## 📸 Screenshots

### Login Page

(Add Screenshot)

### Dashboard

(Add Screenshot)

### Todo Management

(Add Screenshot)

---

## 👨‍💻 Author

Vijayalakshmi Gogineni

GitHub:
https://github.com/vijayalakshmigogineni