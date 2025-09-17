"use client";
import { useState } from "react";

export default function Home() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("password123");
  const [token, setToken] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  async function login() {
    const res = await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    if (res.ok) {
      const data = await res.json();
      setToken(data.token);
      loadTasks(username, password);
    } else {
      alert("Login failed");
    }
  }

  async function loadTasks(u, p) {
    const res = await fetch("http://localhost:4000/tasks", {
      headers: { username: u, password: p }
    });
    const data = await res.json();
    setTasks(data);
  }

  async function addTask() {
    await fetch("http://localhost:4000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        username,
        password
      },
      body: JSON.stringify({ title, priority: "med" })
    });
    setTitle("");
    loadTasks(username, password);
  }

  if (!token) {
    return (
      <div className="flex flex-col items-center mt-20">
        <h1 className="text-2xl font-bold">Login</h1>
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="username"
          className="border p-2 m-2"
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="password"
          className="border p-2 m-2"
        />
        <button onClick={login} className="bg-blue-500 text-white p-2 rounded">
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Tasks</h1>
      <div className="flex mb-4">
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="New task"
          className="border p-2 flex-grow"
        />
        <button onClick={addTask} className="bg-green-500 text-white p-2 ml-2">
          Add
        </button>
      </div>
      <ul>
        {tasks.map(t => (
          <li key={t.id} className="border-b p-2">
            {t.title} — {t.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
