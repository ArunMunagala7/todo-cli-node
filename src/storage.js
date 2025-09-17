const fs = require('fs').promises;
const path = require('path');

// path to our tasks.json file (inside /data)
const DB_PATH = process.env.TODO_DB || path.join(process.cwd(), 'data', 'tasks.json');

// make sure file exists before reading/writing
async function ensureFile() {
  const dir = path.dirname(DB_PATH);
  await fs.mkdir(dir, { recursive: true });
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.writeFile(DB_PATH, '[]', 'utf-8'); // start with empty array
  }
}

async function readAll() {
  await ensureFile();
  const raw = await fs.readFile(DB_PATH, 'utf-8');
  return raw ? JSON.parse(raw) : [];
}

async function writeAll(tasks) {
  await ensureFile();
  await fs.writeFile(DB_PATH, JSON.stringify(tasks, null, 2), 'utf-8');
}

module.exports = { readAll, writeAll, DB_PATH };
