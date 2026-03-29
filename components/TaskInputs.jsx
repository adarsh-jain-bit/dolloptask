"use client"
import React, { useState } from "react";

function TaskInputs({ onTaskAdded }) {
  const [todo, setTodo] = useState({ title: "", description: "", status: "pending" });
  const [loading, setLoading] = useState(false);

  const handleChange = (evt) => {
    setTodo((prev) => ({...prev , [evt.target.name] : evt.target.value}));
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (!todo.title) return;
    setLoading(true);
    
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo)
      });
      if (res.ok) {
        const newTask = await res.json();
        if (onTaskAdded) onTaskAdded(newTask);
        setTodo({ title: "", description: "", status: "pending" });
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
     <>
      <h3 className="text-xl font-bold">Add New Task</h3>
    <form className="bg-white shadow-md items-end rounded px-8 pt-6 pb-8 mb-4 flex flex-row gap-8 max-w-7xl mx-auto" onSubmit={handleSubmit}>
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
        <input
          value={todo.title}
          onChange={handleChange}
          type="text"
          name="title"
          placeholder="New task title..."
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
        <input
          value={todo.description}
          onChange={handleChange}
          type="text"
          name="description"
          placeholder="optional description"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
        <select value={todo.status} name="status" onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-gray-700 bg-white focus:outline-none focus:shadow-outline">
          <option value="pending">Pending</option>
          <option value="in-progress">In-Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <button 
        type="submit" 
        className="bg-blue-500 h-12  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Task'}
      </button>
    </form>
     </>
  );
}

export default TaskInputs;
