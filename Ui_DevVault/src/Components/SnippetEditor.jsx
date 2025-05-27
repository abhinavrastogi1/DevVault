"use client";

import { useState, useEffect } from "react";
import MonacoEditor from "@monaco-editor/react";
import TaskSection from "./TaskSection.jsx";
import NotesSection from "./NotesSection.jsx";
import ChatSection from "./ChatSection.jsx";
import { createUpdateSnippet, deleteTask, saveSnippet } from "../Store/SnippetSlices/snippetslice.js";
import { useDispatch } from "react-redux";
import { GiHamburgerMenu } from "react-icons/gi";

export default function SnippetEditor({ snippet, note_id ,isSmallScreen,showSideBar,setShowSideBar}) {
  const [title, setTitle] = useState(snippet.title);
  const [code, setCode] = useState(snippet.code||"");
  const [notes, setNotes] = useState(snippet.notes||"");
  const [tasks, setTasks] = useState(snippet.tasks||[]);
  const [language, setLanguage] = useState(snippet.language || "javascript");
  const[questions, setQuestions] = useState(snippet.questions || []);
  const[newQuestion, setNewQuestion] = useState("");
const dispatch = useDispatch();
  // Update local state when snippet changes
  useEffect(() => {
    setTitle(snippet.title);
    setCode(snippet.code);
    setNotes(snippet.notes);
    setTasks(snippet.tasks);
    setLanguage(snippet.language || "javascript");
    setQuestions(snippet.questions || []);
  }, [snippet]);
  // Save changes to the snippet
  const saveChanges = () => {
    if(title){
  const snippetData={ 
    title:title,
     snippet:code, 
     tasks:tasks, 
     language:language, 
     snippetId:snippet.id,
      noteId:note_id ,   
     note: notes
    } 
  dispatch(saveSnippet(snippetData))}
  };
  const newQuestionHandler = (value) => {
    setNewQuestion(value)
  };
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };
  const handleTaskToggle = (taskId) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)));
  };

  const handleTaskAdd = (text) => {
    if (tasks.length >= 10) return;
    const newTask = { id: "", text, completed: false };
    setTasks([...tasks, newTask]);
  };
  const handleTaskDelete = (taskId) => {
    if(taskId){
      dispatch(deleteTask(taskId));
    }
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
const handleSubmit= (e)=>{
  e.preventDefault();
 const noteId=""
 if(title){
  const snippetData={ title:title,
     snippet:code, 
     userQuestion:newQuestion, 
     tasks:tasks, 
     language:language, 
     snippetId:snippet.id,
      noteId:noteId ,
    } 
    dispatch(createUpdateSnippet(snippetData))
    setNewQuestion("");}
  }
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="border-b border-gray-800 p-4 flex items-center  justify-between space-x-4 bg-gray-900">
      <div className="flex flex-row ">
       { isSmallScreen &&<div className="flex flex-row  justify-center items-center">
        <button className="hover:shadow-2xl  h-8 w-8 items-center flex justify-center scale-110  hover:scale-125  ease-in-out transition transform  "
         onClick={()=>{setShowSideBar(!showSideBar)}}
         >      
            <GiHamburgerMenu className=" hover:shadow-white text-white text-xl font-extrabold hover:cursor-pointer " />
        </button>
        <div className="w-9 h-8 relative mx-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="2">
            {/* Icon for DevVault */}
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="2" />
            <path d="M12 2L12 4" />
            <path d="M12 20L12 22" />
            <path d="M2 12L4 12" />
            <path d="M20 12L22 12" />
            <path d="M4.93 4.93L6.34 6.34" />
            <path d="M17.66 17.66L19.07 19.07" />
            <path d="M4.93 19.07L6.34 17.66" />
            <path d="M17.66 6.34L19.07 4.93" />
          </svg>
        </div>
          </div>
        }
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className="text-lg lg:text-2xl font-bold bg-transparent border-none outline-none w-full ml-3"
          placeholder="Snippet Title"
        /></div>
        <button
          onClick={saveChanges}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors onhover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save 
        </button>
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

          <div className="h-[40vh] border border-gray-800 rounded-md overflow-hidden">
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
        <ChatSection  questions={questions} newQuestionHandler={newQuestionHandler} handleSubmit={handleSubmit} newQuestion={newQuestion} />
      </div>
    </div>
  );
}