const test = require('node:test');
const assert = require('node:assert');
const path = require('path');
const fs = require('fs');

// override DB path so we don’t touch real tasks.json
process.env.TODO_DB = path.join(__dirname, 'tmp_tasks.json');

const { addTask, markDone, editTask, removeTask } = require('../src/tasks');
const { readAll } = require('../src/storage');

test('add + done + edit + delete flow', async () => {
  // clean test DB if exists
  try { fs.unlinkSync(process.env.TODO_DB); } catch {}

  // add a task
  await addTask('Test task', 'high', '2025-12-31');
  let all = await readAll();
  assert.equal(all.length, 1);
  assert.equal(all[0].title, 'Test task');
  assert.equal(all[0].priority, 'high');

  const id = all[0].id;

  // mark done
  await markDone(id);
  all = await readAll();
  assert.equal(all[0].status, 'done');

  // edit
  await editTask({ id, title: 'Edited title', priority: 'low', due: '2026-01-01', undone: true });
  all = await readAll();
  assert.equal(all[0].title, 'Edited title');
  assert.equal(all[0].priority, 'low');
  assert.equal(all[0].due, '2026-01-01');
  assert.equal(all[0].status, 'pending');

  // delete
  await removeTask(id);
  all = await readAll();
  assert.equal(all.length, 0);
});
