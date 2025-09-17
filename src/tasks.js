const { readAll, writeAll } = require('./storage');
const { randomUUID } = require('crypto');

// validate priority
function validPriority(p) {
  return ['low', 'med', 'high'].includes(p);
}

// validate date
function parseDue(due) {
  if (!due) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(due)) {
    throw new Error('Invalid due date. Use YYYY-MM-DD');
  }
  return due;
}

// add new task
async function addTask(title, priority = 'med', due) {
  if (!title || !title.trim()) throw new Error('Title is required');
  if (!validPriority(priority)) throw new Error('Priority must be low|med|high');

  const tasks = await readAll();
  const now = new Date().toISOString();

  const task = {
    id: randomUUID().slice(0, 8),
    title: title.trim(),
    priority,
    due: parseDue(due),
    status: 'pending',
    createdAt: now,
    updatedAt: now
  };

  tasks.push(task);
  await writeAll(tasks);
  console.log(`✅ Added: ${task.id} "${task.title}"`);
}

// list tasks
async function listTasks({ all, done, search }) {
  const tasks = await readAll();
  let filtered = tasks;

  if (!all && !done) filtered = filtered.filter(t => t.status !== 'done');
  if (done) filtered = filtered.filter(t => t.status === 'done');
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(t => t.title.toLowerCase().includes(q));
  }

  if (!filtered.length) {
    console.log('No tasks to show.');
    return;
  }

  console.table(
    filtered.map(t => ({
      id: t.id,
      title: t.title,
      status: t.status,
      priority: t.priority,
      due: t.due || '',
      created: t.createdAt.slice(0, 10),
      updated: t.updatedAt.slice(0, 10)
    }))
  );
}

// mark a task as done
async function markDone(id) {
  const tasks = await readAll();
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) throw new Error('Task not found');

  tasks[idx].status = 'done';
  tasks[idx].updatedAt = new Date().toISOString();
  await writeAll(tasks);
  console.log(`🟩 Done: ${id}`);
}

// delete a task
async function removeTask(id) {
  const tasks = await readAll();
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) throw new Error('Task not found');

  const [removed] = tasks.splice(idx, 1);
  await writeAll(tasks);
  console.log(`🗑️ Deleted: ${removed.id} "${removed.title}"`);
}

// edit a task
async function editTask({ id, title, priority, due, undone }) {
  const tasks = await readAll();
  const t = tasks.find(x => x.id === id);
  if (!t) throw new Error('Task not found');

  if (title !== undefined) t.title = title.trim();
  if (priority !== undefined) {
    if (!validPriority(priority)) throw new Error('Priority must be low|med|high');
    t.priority = priority;
  }
  if (due !== undefined) t.due = parseDue(due);
  if (undone) t.status = 'pending';

  t.updatedAt = new Date().toISOString();
  await writeAll(tasks);
  console.log(`✏️  Edited: ${id}`);
}

module.exports = { addTask, listTasks, markDone, removeTask, editTask };
