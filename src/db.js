const Database = require("better-sqlite3");

// open (or create) database file
const db = new Database("data/tasks.db");

// create tasks table if not exists
db.prepare(`
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    priority TEXT DEFAULT 'med',
    due TEXT
  )
`).run();

module.exports = db;
