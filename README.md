# todo-cli-node

A lightweight **Task Manager CLI** built with **Node.js**.

✨ Features:
- **CRUD operations**: add, list, edit, mark done, delete
- **JSON persistence** (tasks are saved between runs)
- **Minimal dependency**: only uses [yargs](https://github.com/yargs/yargs)
- **Unit test included** (Node’s built-in `node:test`)

---

## 🚀 Quickstart

Clone and install:
```
git clone https://github.com/<your-username>/todo-cli-node.git
cd todo-cli-node
npm install
npm link   # optional, lets you use `todo` globally
```

---

## 🛠 Usage

```
# Add tasks
todo add "Buy milk" -p high -d 2025-09-20
todo add "Write blog post" -p med

# List tasks
todo list           # pending tasks
todo list --all     # all tasks
todo list --done    # only done
todo list --search "milk"

# Update tasks
todo done <id>
todo edit <id> "New title" -p low -d 2025-10-01
todo edit <id> -u   # re-open a task
todo delete <id>
```

---

## 📦 Scripts

```
npm start -- add "Task title"
npm test
```

---

## 🔧 Tech Stack
- **Node.js** (CommonJS)
- **yargs** for CLI argument parsing
- **node:test** for unit testing
- JSON file persistence (path configurable via `TODO_DB` env)

---

## 🗺️ Roadmap
- [ ] REST API with Express/Fastify
- [ ] SQLite/Postgres backend
- [ ] Per-user authentication (JWT)
- [ ] Web frontend (React/Next.js)
- [ ] Import/export CSV
- [ ] Task stats (by priority, due dates)
