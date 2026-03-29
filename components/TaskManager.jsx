"use client"
import React, { useState, useEffect } from 'react';
import TaskInputs from './TaskInputs';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: '', description: '' });

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskAdded = (newTask) => {
    setTasks(prev => [newTask, ...prev]);
  };

  const handleDragStart = (e, taskId) => {
    if (editingTaskId === taskId) {
      e.preventDefault();
      return;
    }
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    if (!draggedTaskId) return;

    const taskToMove = tasks.find(t => t._id === draggedTaskId);
    if (!taskToMove || taskToMove.status === newStatus) {
      setDraggedTaskId(null);
      return;
    }

    const previousTasks = [...tasks];
    setTasks(prev => prev.map(t => 
      t._id === draggedTaskId ? { ...t, status: newStatus } : t
    ));

    try {
      const res = await fetch(`/api/tasks/${draggedTaskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error("API failed");
    } catch (err) {
      console.error("Failed to update status, reverting UI", err);
      setTasks(previousTasks);
    } finally {
      setDraggedTaskId(null);
    }
  };

  const handleDelete = async (taskId) => {
    const previousTasks = [...tasks];
    setTasks(prev => prev.filter(t => t._id !== taskId));
    try {
      await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
    } catch(err) {
      console.error("Delete failed, reverting UI");
      setTasks(previousTasks);
    }
  };

  const handleEditClick = (task) => {
    setEditingTaskId(task._id);
    setEditFormData({ title: task.title, description: task.description || '' });
  };

  const handleEditChange = (e) => {
    setEditFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditSave = async (taskId) => {
    if (!editFormData.title.trim()) return;
    
   
    const previousTasks = [...tasks];
    setTasks(prev => prev.map(t => 
      t._id === taskId ? { ...t, ...editFormData } : t
    ));
    setEditingTaskId(null);

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData)
      });
      if (!res.ok) throw new Error("API failed");
    } catch (err) {
      console.error("Failed to update task, reverting UI", err);
      setTasks(previousTasks);
    }
  };

  const handleEditCancel = () => {
    setEditingTaskId(null);
  };

  const renderColumn = (title, statusValue, bgColorClass) => {
    const columnTasks = tasks.filter(t => t.status === statusValue);
    
    return (
      <div 
        className={`flex-1 flex flex-col p-4 rounded-xl min-h-[500px] border-2 border-transparent hover:border-blue-300 transition-colors ${bgColorClass}`}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, statusValue)}
      >
        <h2 className='text-xl mb-4 text-center font-bold text-gray-700 tracking-wide uppercase'>{title} <span className="text-sm font-normal text-gray-500">({columnTasks.length})</span></h2>
        <div className="flex flex-col gap-4 flex-1">
          {columnTasks.map(task => (
            <div 
              key={task._id}
              draggable={editingTaskId !== task._id}
              onDragStart={(e) => handleDragStart(e, task._id)}
              className={`bg-white border border-gray-200 p-4 rounded-lg shadow-sm transition-shadow relative group ${editingTaskId === task._id ? '' : 'cursor-grab active:cursor-grabbing hover:shadow-md'}`}
            >
              {editingTaskId === task._id ? (
                <div className="flex flex-col gap-3">
                  <input 
                    type="text" 
                    name="title" 
                    value={editFormData.title} 
                    onChange={handleEditChange} 
                    className="border rounded px-2 py-1.5 w-full font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Task title"
                    autoFocus
                  />
                  <textarea 
                    name="description" 
                    value={editFormData.description} 
                    onChange={handleEditChange} 
                    className="border rounded px-2 py-1.5 w-full text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Task description"
                    rows="3"
                  />
                  <div className="flex justify-end gap-2 mt-1">
                    <button 
                      onClick={handleEditCancel}
                      className="text-gray-600 hover:text-gray-800 text-xs px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => handleEditSave(task._id)}
                      className="text-white bg-blue-500 hover:bg-blue-600 text-xs font-semibold px-4 py-1.5 rounded shadow-sm transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div className="font-bold text-lg text-gray-800 break-words flex-1 pr-2">{task.title}</div>
                    <button 
                      onClick={() => handleEditClick(task)}
                      className="text-blue-500 hover:text-blue-700 text-xs font-semibold px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                    >
                      Edit
                    </button>
                  </div>
                  {task.description && <div className="text-gray-600 mt-2 text-sm whitespace-pre-wrap flex-1 break-words">{task.description}</div>}
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-400">{new Date(task.createdAt).toLocaleDateString()}</span>
                    <button 
                      onClick={() => handleDelete(task._id)}
                      className="text-red-500 hover:text-red-700 text-xs font-semibold px-2 py-1 rounded bg-red-50 hover:bg-red-100 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
          {columnTasks.length === 0 && (
            <div className="flex items-center justify-center flex-1 h-full min-h-[100px] text-gray-400 py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <span className="text-sm">Drop tasks here</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className='max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 font-sans'>
      <h2 className='text-3xl sm:text-4xl font-extrabold mb-8 text-center text-gray-800 tracking-tight'>Task Board</h2>
      
      <TaskInputs onTaskAdded={handleTaskAdded} />
      
      <div className="flex flex-col lg:flex-row justify-between gap-6 mt-10">
        {renderColumn('Pending', 'pending', 'bg-gray-50')}
        {renderColumn('In Progress', 'in-progress', 'bg-blue-50/50')}
        {renderColumn('Completed', 'completed', 'bg-green-50/50')}
      </div>
    </div>
  )
}

export default TaskManager;