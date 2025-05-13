"use client";
import { useState } from "react";
import { CheckSquare, Square, Trash2, Plus } from "lucide-react";

export default function TaskSection({ tasks, onTaskToggle, onTaskAdd, onTaskDelete }) {
  const [newTaskText, setNewTaskText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      onTaskAdd(newTaskText.trim());
      setNewTaskText("");
    }
  };
  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Tasks</h2>

      <div className="max-h-40 overflow-y-auto mb-4">
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-sm">No tasks yet. Add a task below.</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li key={task.id} className="flex items-start group">
                <button onClick={() => onTaskToggle(task.id)} className="flex-shrink-0 mt-0.5 mr-2">
                  {task.completed ? (
                    <CheckSquare className="h-5 w-5 text-blue-500" />
                  ) : (
                    <Square className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                <span className={`flex-1 ${task.completed ? "line-through text-gray-500" : "text-white"}`}>
                  {task.text}
                </span>
                <button
                  onClick={() => onTaskDelete(task.id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-500 transition-opacity"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {tasks.length < 10 && (
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-r-md"
            disabled={!newTaskText.trim()}
          >
            <Plus className="h-4 w-4" />
          </button>
        </form>
      )}

      {tasks.length >= 10 && (
        <p className="text-amber-500 text-xs mt-2">Maximum of 10 tasks reached. Delete a task to add a new one.</p>
      )}
    </div>
  );
}
