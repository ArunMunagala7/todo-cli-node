# 📝 Full-Stack Task Manager

A simple **Task Manager** project built to practice **full-stack development** concepts.

---

## 🔧 Tech Stack
- **Backend**: Node.js + Express + JWT Authentication + SQLite  
- **Frontend**: Next.js (React) + TailwindCSS  
- **Other Tools**: ngrok (temporary tunneling for backend), Vercel (frontend deployment), GitHub  

---

## 🚀 Features
- User login with JWT authentication  
- Add, edit, mark as done, delete tasks  
- Priority levels (low / medium / high)  
- Due date support  
- Token persistence (saved in localStorage)  
- Backend with SQLite database  
- Deployed frontend on **Vercel**  

---

## 📂 Project Structure
todo-cli-node/  
├── server.js        # Express API with JWT + SQLite  
├── src/  
│   ├── db.js        # SQLite database setup  
│   ├── storage.js   # DB operations  
│   └── tasks.js     # Task CRUD logic  
├── frontend/        # Next.js frontend  
└── data/tasks.db    # SQLite database file  

---

## ⚡ Usage

### 1. Backend (Express + SQLite)

Start backend locally:
    npm run server

Runs at http://localhost:4000  

**Test with curl:**

Login:
    curl -X POST http://localhost:4000/login \
      -H "Content-Type: application/json" \
      -d '{"username":"admin","password":"password123"}'

Add Task:
    curl -X POST http://localhost:4000/tasks \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer <your_token>" \
      -d '{"title":"Test Task","priority":"high"}'

---

### 2. Frontend (Next.js + TailwindCSS)

Start frontend locally:
    cd frontend
    npm run dev

Runs at http://localhost:3000  

**Deployment**:  
Frontend deployed on **Vercel**.  
Backend exposed via **ngrok** and connected using an environment variable:

    NEXT_PUBLIC_API_URL=https://<your-ngrok-url>.ngrok-free.app

---

## 📋 Example Workflow
1. Login with `admin / password123`  
2. Add a task → select priority  
3. Edit task title or priority  
4. Mark task as done ✅  
5. Delete task 🗑️  

---

## 📌 Improvements (Future Work)
- Replace ngrok with a permanent backend deployment (Railway/Render/Heroku)  
- Add user registration + multiple users  
- Add due date reminders  
- Task filtering & sorting  
- UI polish with Tailwind components  
