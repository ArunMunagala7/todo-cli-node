"use client";
import { useState } from "react";

export default function Home() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("password123");
  const [token, setToken] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("med"); // NEW
  const [editValues, setEditValues] = useState({});

  async function login() {
    const res = await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    if (res.ok) {
      const data = await res.json();
      setToken(data.token);
      await loadTasks();
    } else {
      alert("Login failed");
    }
  }

  async function loadTasks() {
    const res = await fetch("http://localhost:4000/tasks", {
      headers: { username, password }
    });
    const data = await res.json();
    setTasks(data);
  }

  async function addTask() {
    if (!title.trim()) return;
    await fetch("http://localhost:4000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        username,
        password
      },
      body: JSON.stringify({ title, priority })
    });
    setTitle("");
    setPriority("med"); // reset after adding
    await loadTasks();
  }

  async function markDone(id) {
    await fetch(`http://localhost:4000/tasks/${id}/done`, {
      method: "PUT",
      headers: { username, password }
    });
    await loadTasks();
  }

  async function deleteTask(id) {
    await fetch(`http://localhost:4000/tasks/${id}`, {
      method: "DELETE",
      headers: { username, password }
    });
    await loadTasks();
  }

  async function editTask(id) {
    const newTitle = (editValues[id] || "").trim();
    if (!newTitle) return;
    await fetch(`http://localhost:4000/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        username,
        password
      },
      body: JSON.stringify({ title: newTitle })
    });
    setEditValues(prev => ({ ...prev, [id]: "" }));
    await loadTasks();
  }

  function priorityBadge(p) {
    const colors = {
      low: "bg-green-200 text-green-800",
      med: "bg-yellow-200 text-yellow-800",
      high: "bg-red-200 text-red-800"
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded ${colors[p] || "bg-gray-200"}`}>
        {p}
      </span>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-4 border rounded-xl p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-center">Login</h1>
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="username"
            className="border rounded w-full p-2"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="password"
            className="border rounded w-full p-2"
          />
          <button
            onClick={login}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tasks</h1>

      {/* Task input form */}
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="New task title"
          className="border rounded p-2 flex-1"
        />
        <select
          value={priority}
          onChange={e => setPriority(e.target.value)}
          className="border rounded p-2"
        >
          <option value="low">Low</option>
          <option value="med">Medium</option>
          <option value="high">High</option>
        </select>
        <button
          onClick={addTask}
          className="bg-green-600 hover:bg-green-700 text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      {/* Task list */}
      <ul className="space-y-3">
        {tasks.map(t => (
          <li
            key={t.id}
            className="border rounded-lg p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium">{t.title}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-gray-100">{t.status}</span>
              {priorityBadge(t.priority)}
              {t.due && (
                <span className="text-xs px-2 py-0.5 rounded bg-gray-100">
                  due {t.due}
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <div className="flex gap-2">
                <button
                  onClick={() => markDone(t.id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Done
                </button>
                <button
                  onClick={() => deleteTask(t.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  placeholder="Edit title"
                  value={editValues[t.id] ?? ""}
                  onChange={e =>
                    setEditValues(prev => ({ ...prev, [t.id]: e.target.value }))
                  }
                  className="border rounded p-1"
                />
                <button
                  onClick={() => editTask(t.id)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
              </div>
            </div>
          </li>
        ))}
        {!tasks.length && (
          <li className="text-gray-500">No tasks yet. Add one above.</li>
        )}
      </ul>
    </div>
  );
}
