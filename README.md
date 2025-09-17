# todo-cli-node

A full-stack **Task Manager** project showing evolution from a simple CLI → REST API → Web frontend.

✨ Features:
- **CLI Tool** (`todo`) built in **Node.js** with [yargs](https://github.com/yargs/yargs)  
- **REST API** powered by **Express + CORS** with basic authentication  
- **Frontend** built using **Next.js + TailwindCSS** (App Router, Turbopack)  
- **Persistent Storage** via JSON file (pluggable for SQLite/Postgres later)  
- **Unit tests** using Node’s built-in `node:test`

---

## 🚀 Quickstart

### 1. Clone and install
```bash
git clone https://github.com/<your-username>/todo-cli-node.git
cd todo-cli-node
npm install
```

---

## 🖥️ CLI Usage

Run CLI directly:
```bash
npm start -- <command>
```

Or install globally:
```bash
npm link
todo <command>
```

### ➕ Add a task
```bash
npm start -- add "Buy groceries" -p high -d 2025-09-20
```

### 📋 List tasks
```bash
npm start -- list
npm start -- list --all
npm start -- list --done
npm start -- list --search "groceries"
```

### ✅ Mark as done
```bash
npm start -- done <id>
```

### ✏️ Edit a task
```bash
npm start -- edit <id> "Updated title" -p low -d 2025-10-01
```

### 🗑️ Delete a task
```bash
npm start -- delete <id>
```

---

## 🌐 REST API Usage

Start the API server:
```bash
npm run server
```

Base URL: `http://localhost:4000`

### ➕ Add a task
```bash
curl -X POST http://localhost:4000/tasks \
  -H "Content-Type: application/json" \
  -H "username: admin" \
  -H "password: password123" \
  -d '{"title":"Buy groceries","priority":"high","due":"2025-09-20"}'
```

### 📋 List tasks
```bash
curl -X GET http://localhost:4000/tasks \
  -H "username: admin" \
  -H "password: password123"
```

### ✅ Mark as done
```bash
curl -X PUT http://localhost:4000/tasks/<id>/done \
  -H "username: admin" \
  -H "password: password123"
```

### ✏️ Edit a task
```bash
curl -X PUT http://localhost:4000/tasks/<id> \
  -H "Content-Type: application/json" \
  -H "username: admin" \
  -H "password: password123" \
  -d '{"title":"Updated title","priority":"low","due":"2025-10-01"}'
```

### 🗑️ Delete a task
```bash
curl -X DELETE http://localhost:4000/tasks/<id> \
  -H "username: admin" \
  -H "password: password123"
```

---

## 🌍 Frontend Usage (Next.js)

Start the frontend:
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)  

- **Login credentials**:  
  - username: `admin`  
  - password: `password123`  

From the UI you can:  
- ➕ Add a task (use the input box + “Add” button)  
- 📋 View tasks (listed below the input)  
- (Extensions possible: edit, mark done, delete in UI)

---

## 📦 Scripts
```bash
npm start        # run CLI
npm run server   # run Express API
npm test         # run unit tests
```

---

## 🔧 Tech Stack
- **Node.js** (CLI + API)
- **yargs** for CLI parsing
- **express + cors + body-parser** for REST API
- **Next.js (App Router, Turbopack) + TailwindCSS** for frontend
- **node:test** for unit tests
- JSON storage (extensible to SQLite/Postgres)

---

## 🏗️ Architecture Overview

```text
           ┌─────────────┐
           │   Frontend  │  (Next.js + Tailwind)
           │   http://localhost:3000
           └───────┬─────┘
                   │ REST API calls (fetch)
                   ▼
           ┌─────────────┐
           │   Backend   │  (Express API)
           │   http://localhost:4000
           └───────┬─────┘
                   │ uses
                   ▼
           ┌─────────────┐
           │  Storage    │  (JSON file)
           │  data/tasks.json
           └─────────────┘
```

- **Authentication:** basic (username/password in headers)  
- **Persistence:** JSON file (future: SQLite/Postgres)  
- **Expansion Path:** JWT auth, multi-user, cloud deployment  

---

## 🗺️ Roadmap
- [ ] Upgrade persistence to SQLite/Postgres  
- [ ] JWT-based auth  
- [ ] Deploy frontend (Vercel) + backend (Railway/Render)  
- [ ] Add charts & filters to tasks  
- [ ] Multi-user support  
