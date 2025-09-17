const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { addTask, listTasks, markDone, removeTask, editTask } = require('./src/tasks');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// fake auth middleware
const USERS = { admin: "password123" };
function auth(req, res, next) {
  const { username, password } = req.headers;
  if (!username || !password || USERS[username] !== password) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// routes
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (USERS[username] === password) {
    return res.json({ token: "fake-jwt-token", username });
  }
  res.status(401).json({ error: "Invalid credentials" });
});

app.get('/tasks', auth, async (req, res) => {
  const tasks = [];
  await listTasks({ all: true }).catch(console.error); // console prints too
  res.json(await require('./src/storage').readAll());
});

app.post('/tasks', auth, async (req, res) => {
  const { title, priority, due } = req.body;
  await addTask(title, priority, due);
  res.json({ success: true });
});

app.put('/tasks/:id/done', auth, async (req, res) => {
  await markDone(req.params.id);
  res.json({ success: true });
});

app.put('/tasks/:id', auth, async (req, res) => {
  const { title, priority, due, undone } = req.body;
  await editTask({ id: req.params.id, title, priority, due, undone });
  res.json({ success: true });
});

app.delete('/tasks/:id', auth, async (req, res) => {
  await removeTask(req.params.id);
  res.json({ success: true });
});

// start server
const PORT = 4000;
app.listen(PORT, () => console.log(`✅ API running at http://localhost:${PORT}`));
