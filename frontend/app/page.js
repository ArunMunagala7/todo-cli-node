"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("med");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState("med");

  // Load token from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("token");
    if (saved) {
      setToken(saved);
      fetchTasks(saved);
    }
  }, []);

  async function login() {
    const res = await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.token) {
      setToken(data.token);
      localStorage.setItem("token", data.token); // save token persistently
      fetchTasks(data.token);
    } else {
      alert("Invalid login");
    }
  }

  async function fetchTasks(tok = token) {
    const res = await fetch("http://localhost:4000/tasks", {
      headers: { Authorization: `Bearer ${tok}` },
    });
    const data = await res.json();
    setTasks(data);
  }

  async function addTask() {
    await fetch("http://localhost:4000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, priority }),
    });
    setTitle("");
    setPriority("med");
    fetchTasks();
  }

  async function markDone(id) {
    await fetch(`http://localhost:4000/tasks/${id}/done`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTasks();
  }

  async function removeTask(id) {
    await fetch(`http://localhost:4000/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTasks();
  }

  async function editTask(id) {
    await fetch(`http://localhost:4000/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: editTitle, priority: editPriority }),
    });
    setEditTaskId(null);
    setEditTitle("");
    setEditPriority("med");
    fetchTasks();
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setTasks([]);
  }

  if (!token) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <button
          onClick={login}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Task Manager</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 flex-grow"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="border p-2"
        >
          <option value="low">Low</option>
          <option value="med">Med</option>
          <option value="high">High</option>
        </select>
        <button
          onClick={addTask}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      <ul className="space-y-3">
        {tasks.map((t) => (
          <li
            key={t.id}
            className="border p-3 flex justify-between items-center"
          >
            {editTaskId === t.id ? (
              <div className="flex gap-2 flex-grow">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="border p-1 flex-grow"
                />
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value)}
                  className="border p-1"
                >
                  <option value="low">Low</option>
                  <option value="med">Med</option>
                  <option value="high">High</option>
                </select>
                <button
                  onClick={() => editTask(t.id)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Save
                </button>
              </div>
            ) : (
              <>
                <div>
                  <p className="font-semibold">
                    {t.title}{" "}
                    <span className="text-sm text-gray-500">
                      ({t.priority})
                    </span>
                  </p>
                  <p className="text-sm text-gray-400">{t.status}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditTaskId(t.id) || setEditTitle(t.title) || setEditPriority(t.priority)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => markDone(t.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Done
                  </button>
                  <button
                    onClick={() => removeTask(t.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
