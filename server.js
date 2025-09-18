const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { addTask, listTasks, markDone, removeTask, editTask } = require('./src/tasks');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// fake user db (for demo)
const USERS = { admin: "password123" };
const SECRET = "supersecretkey"; // in production use env vars

// login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (USERS[username] && USERS[username] === password) {
    const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });
    return res.json({ token, username });
  }
  res.status(401).json({ error: "Invalid credentials" });
});

// auth middleware
function auth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid or expired token" });
    req.user = user;
    next();
  });
}

// routes
app.get('/tasks', auth, async (req, res) => {
  try {
    const tasks = await listTasks({ all: true });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/tasks', auth, async (req, res) => {
  const { title, priority, due } = req.body;
  try {
    await addTask(title, priority, due);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/tasks/:id/done', auth, async (req, res) => {
  try {
    await markDone(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/tasks/:id', auth, async (req, res) => {
  const { title, priority, due, undone } = req.body;
  try {
    await editTask({ id: req.params.id, title, priority, due, undone });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/tasks/:id', auth, async (req, res) => {
  try {
    await removeTask(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// use Render's port (or 4000 locally)
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ API running on port ${PORT}`));
