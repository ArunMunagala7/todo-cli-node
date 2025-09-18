const db = require("./db");

function readAll() {
  return db.prepare("SELECT * FROM tasks").all();
}

function addTask(id, title, priority, due) {
  db.prepare(
    "INSERT INTO tasks (id, title, priority, due) VALUES (?, ?, ?, ?)"
  ).run(id, title, priority, due);
}

function updateTask(id, fields) {
  const sets = [];
  const values = [];
  if (fields.title) {
    sets.push("title = ?");
    values.push(fields.title);
  }
  if (fields.priority) {
    sets.push("priority = ?");
    values.push(fields.priority);
  }
  if (fields.due) {
    sets.push("due = ?");
    values.push(fields.due);
  }
  if (fields.undone) {
    sets.push("status = 'pending'");
  }
  values.push(id);
  db.prepare(`UPDATE tasks SET ${sets.join(", ")} WHERE id = ?`).run(values);
}

function markDone(id) {
  db.prepare("UPDATE tasks SET status = 'done' WHERE id = ?").run(id);
}

function removeTask(id) {
  db.prepare("DELETE FROM tasks WHERE id = ?").run(id);
}

module.exports = { readAll, addTask, updateTask, markDone, removeTask };
