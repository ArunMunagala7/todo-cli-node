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

### 2. CLI Usage
```bash
# Add tasks
npm start -- add "Buy milk" -p high -d 2025-09-20
npm start -- list
npm start -- done <id>
npm start -- delete <id>
npm start -- edit <id> "New title" -p low -d 2025-10-01
```

Install globally (optional):
```bash
npm link
todo list
```

---

### 3. REST API
Start API server:
```bash
npm run server
```

Base URL: `http://localhost:4000`

#### Endpoints:
- `POST /login` → `{ username, password }` → returns token  
- `GET /tasks` → list tasks (requires auth headers)  
- `POST /tasks` → add task  
- `PUT /tasks/:id/done` → mark done  
- `PUT /tasks/:id` → edit task  
- `DELETE /tasks/:id` → delete task  

#### Example with curl:
```bash
curl -X GET http://localhost:4000/tasks \
  -H "username: admin" \
  -H "password: password123"
```

---

### 4. Frontend
Scaffolded with **Next.js** + **TailwindCSS**.  

Run the dev server:
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) → login with:  
- **username:** `admin`  
- **password:** `password123`  

You can add and list tasks through the UI.

---

## 📦 Scripts
```bash
npm start   # run CLI
npm run server   # run Express API
npm test    # run unit tests
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

## 🗺️ Roadmap
- [ ] Upgrade persistence to SQLite/Postgres
- [ ] JWT-based auth
- [ ] Deploy frontend (Vercel) + backend (Railway/Render)
- [ ] Add charts & filters to tasks
- [ ] Multi-user support
