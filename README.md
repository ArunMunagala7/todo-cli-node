# 📝 Full-Stack Task Manager

A simple **Task Manager** built with:

- **Backend**: Node.js + Express + JWT Authentication + SQLite  
- **Frontend**: Next.js (React) with TailwindCSS  
- **Features**: Add, edit, mark done, delete tasks, authentication with JWT, token persistence (localStorage), logout.

---

## 📂 Project Structure
```
todo-cli-node/
├── server.js          # Express API with JWT + SQLite
├── src/
│   ├── db.js          # SQLite database setup
│   ├── storage.js     # DB operations
│   └── tasks.js       # Task CRUD logic
├── frontend/          # Next.js frontend
└── data/tasks.db      # SQLite database file
```

---

## 🚀 Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/<your-username>/todo-cli-node.git
cd todo-cli-node
```

### 2. Install backend dependencies
```bash
npm install
```

### 3. Install frontend dependencies
```bash
cd frontend
npm install
cd ..
```

---

## ▶️ Running the Project

### Start the backend
From project root:
```bash
npm run server
```
API will run at **http://localhost:4000**

### Start the frontend
Open another terminal:
```bash
cd frontend
npm run dev
```
Frontend will run at **http://localhost:3000**

---

## 🔑 Authentication (JWT)

1. **Login** with:
   - Username: `admin`  
   - Password: `password123`  

2. Backend issues a **JWT token** which is stored in browser `localStorage`.  

3. All subsequent requests attach the token:
   ```
   Authorization: Bearer <jwt_token>
   ```

4. Logout clears the token.  

---

## 🔄 JWT Flow Diagram
```text
User Login → /login → Server verifies → Issues JWT → 
Frontend stores JWT → 
Frontend requests /tasks with "Authorization: Bearer <token>" →
Server verifies JWT → Grants access
```

---

## 📌 Features

### ✅ Task Operations
- **Add**: Enter task title + priority → click Add  
- **Edit**: Click Edit → change title/priority → Save  
- **Mark Done**: Click Done → status changes to `done`  
- **Delete**: Click Delete → removes task  

### ✅ Authentication
- JWT issued on login  
- Token persists in localStorage  
- Logout button clears session  

---

## 🗄️ Database
- Uses **SQLite** (`data/tasks.db`)  
- Table schema:
```sql
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'med',
  due TEXT,
  createdAt TEXT,
  updatedAt TEXT
);
```

Check tasks directly in DB:
```bash
sqlite3 data/tasks.db
SELECT * FROM tasks;
.exit
```

---

## 🌐 Deployment (optional)
- **Backend** → [Render](https://render.com/) or [Railway](https://railway.app/)  
- **Frontend** → [Vercel](https://vercel.com/)  

---

## 📖 Resume-Ready Highlights
- 🔐 Implemented **JWT authentication** with persistent login + logout.  
- 🗄️ Migrated from JSON storage → **SQLite database**.  
- ⚡ Built full-stack app with **Express + Next.js**.  
- 🎨 Responsive UI with **TailwindCSS**.  

---

## 📸 Screenshots (optional)
- Login screen  
- Task dashboard  
- Database view (SQLite)  

---

## 👨‍💻 Author
**Arun Munagala**  
US Citizen 🇺🇸 | Master’s in Intelligent Systems @ Indiana University
