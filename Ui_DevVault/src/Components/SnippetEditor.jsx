"use client";

import { useState, useEffect } from "react";
import MonacoEditor from "@monaco-editor/react";
import TaskSection from "./TaskSection.jsx";
import NotesSection from "./NotesSection.jsx";
import ChatSection from "./ChatSection.jsx";

export default function SnippetEditor({ snippet, onUpdate }) {
  const [title, setTitle] = useState(snippet.title);
  const [code, setCode] = useState(snippet.code);
  const [notes, setNotes] = useState(snippet.notes);
  const [tasks, setTasks] = useState(snippet.tasks);
  const [language, setLanguage] = useState(snippet.language || "javascript");

  // Update local state when snippet changes
  useEffect(() => {
    setTitle(snippet.title);
    setCode(snippet.code);
    setNotes(snippet.notes);
    setTasks(snippet.tasks);
    setLanguage(snippet.language || "javascript");
  }, [snippet]);

  // Save changes to the snippet
  const saveChanges = () => {
    onUpdate({
      ...snippet,
      title,
      code,
      notes,
      tasks,
      language,
    });
  };

  // Auto-save when changes are made
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveChanges();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [title, code, notes, tasks, language]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleTaskToggle = (taskId) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)));
  };

  const handleTaskAdd = (text) => {
    if (tasks.length >= 10) return;
    const newTask = { id: Date.now().toString(), text, completed: false };
    setTasks([...tasks, newTask]);
  };

  const handleTaskDelete = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleNotesChange = (value) => {
    setNotes(value);
  };

  const handleCodeChange = (value) => {
    if (value !== undefined) setCode(value);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="border-b border-gray-800 p-4">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className="text-2xl font-bold bg-transparent border-none outline-none w-full"
          placeholder="Snippet Title"
        />
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TaskSection tasks={tasks} onTaskToggle={handleTaskToggle} onTaskAdd={handleTaskAdd} onTaskDelete={handleTaskDelete} />
          <NotesSection notes={notes} onNotesChange={handleNotesChange} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Code Snippet</h2>
            <select
              value={language}
              onChange={handleLanguageChange}
              className="bg-gray-800 border border-gray-700 rounded-md px-2 py-1 text-sm"
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="csharp">C#</option>
              <option value="cpp">C++</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
              <option value="php">PHP</option>
              <option value="ruby">Ruby</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="json">JSON</option>
              <option value="markdown">Markdown</option>
              <option value="sql">SQL</option>
            </select>
          </div>

          <div className="h-64 border border-gray-800 rounded-md overflow-hidden">
            <MonacoEditor
              height="100%"
              language={language}
              value={code}
              onChange={handleCodeChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
                wordWrap: "on",
              }}
            />
          </div>
        </div>

        <ChatSection snippetId={snippet.id} />
      </div>
    </div>
  );
}
