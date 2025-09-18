const { randomUUID } = require("crypto");
const db = require("./db");

// validate priority
function validPriority(p) {
  return ["low", "med", "high"].includes(p);
}

// validate date
function parseDue(due) {
  if (!due) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(due)) {
    throw new Error("Invalid due date. Use YYYY-MM-DD");
  }
  return due;
}

// add new task
async function addTask(title, priority = "med", due) {
  if (!title || !title.trim()) throw new Error("Title is required");
  if (!validPriority(priority)) throw new Error("Priority must be low|med|high");

  const now = new Date().toISOString();
  const task = {
    id: randomUUID().slice(0, 8),
    title: title.trim(),
    priority,
    due: parseDue(due),
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };

  db.prepare(
    "INSERT INTO tasks (id, title, priority, due, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run(
    task.id,
    task.title,
    task.priority,
    task.due,
    task.status,
    task.createdAt,
    task.updatedAt
  );

  console.log(`✅ Added: ${task.id} "${task.title}"`);
}

// list tasks
async function listTasks({ all, done, search }) {
  let query = "SELECT * FROM tasks";
  const conditions = [];
  const params = [];

  if (!all && !done) {
    conditions.push("status != ?");
    params.push("done");
  }
  if (done) {
    conditions.push("status = ?");
    params.push("done");
  }
  if (search) {
    conditions.push("LOWER(title) LIKE ?");
    params.push(`%${search.toLowerCase()}%`);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  const tasks = db.prepare(query).all(...params);

  if (!tasks.length) {
    console.log("No tasks to show.");
    return;
  }

  console.table(
    tasks.map((t) => ({
      id: t.id,
      title: t.title,
      status: t.status,
      priority: t.priority,
      due: t.due || "",
      created: t.createdAt.slice(0, 10),
      updated: t.updatedAt.slice(0, 10),
    }))
  );
}

// mark a task as done
async function markDone(id) {
  const now = new Date().toISOString();
  const result = db
    .prepare("UPDATE tasks SET status = ?, updatedAt = ? WHERE id = ?")
    .run("done", now, id);

  if (result.changes === 0) throw new Error("Task not found");
  console.log(`🟩 Done: ${id}`);
}

// delete a task
async function removeTask(id) {
  const result = db.prepare("DELETE FROM tasks WHERE id = ?").run(id);
  if (result.changes === 0) throw new Error("Task not found");
  console.log(`🗑️ Deleted: ${id}`);
}

// edit a task
async function editTask({ id, title, priority, due, undone }) {
  const now = new Date().toISOString();
  const updates = [];
  const params = [];

  if (title !== undefined) {
    updates.push("title = ?");
    params.push(title.trim());
  }
  if (priority !== undefined) {
    if (!validPriority(priority))
      throw new Error("Priority must be low|med|high");
    updates.push("priority = ?");
    params.push(priority);
  }
  if (due !== undefined) {
    updates.push("due = ?");
    params.push(parseDue(due));
  }
  if (undone) {
    updates.push("status = ?");
    params.push("pending");
  }

  updates.push("updatedAt = ?");
  params.push(now);
  params.push(id);

  const sql = `UPDATE tasks SET ${updates.join(", ")} WHERE id = ?`;
  const result = db.prepare(sql).run(...params);

  if (result.changes === 0) throw new Error("Task not found");
  console.log(`✏️  Edited: ${id}`);
}

module.exports = { addTask, listTasks, markDone, removeTask, editTask };
