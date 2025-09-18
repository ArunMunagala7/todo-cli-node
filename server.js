const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const { addTask, listTasks, markDone, removeTask, editTask } = require("./src/tasks");
const { readAll } = require("./src/storage");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🔹 Hardcoded user (for demo)
const USERS = { admin: "password123" };
const SECRET_KEY = "supersecretkey"; // in real apps use env var

// Middleware: verify JWT
function authenticateJWT(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid or expired token" });
    req.user = user;
    next();
  });
}

// 🔹 Login → issue JWT
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (USERS[username] && USERS[username] === password) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    return res.json({ token, username });
  }
  res.status(401).json({ error: "Invalid credentials" });
});

// 🔹 Routes (all protected)
app.get("/tasks", authenticateJWT, async (req, res) => {
  res.json(await readAll());
});

app.post("/tasks", authenticateJWT, async (req, res) => {
  const { title, priority, due } = req.body;
  await addTask(title, priority, due);
  res.json({ success: true });
});

app.put("/tasks/:id/done", authenticateJWT, async (req, res) => {
  await markDone(req.params.id);
  res.json({ success: true });
});

app.put("/tasks/:id", authenticateJWT, async (req, res) => {
  const { title, priority, due, undone } = req.body;
  await editTask({ id: req.params.id, title, priority, due, undone });
  res.json({ success: true });
});

app.delete("/tasks/:id", authenticateJWT, async (req, res) => {
  await removeTask(req.params.id);
  res.json({ success: true });
});

// start server
const PORT = 4000;
app.listen(PORT, () =>
  console.log(`✅ API running with JWT at http://localhost:${PORT}`)
);
