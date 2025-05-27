"use client";

import { use, useState } from "react";
import { format } from "date-fns";
import { LogOut, Code, CheckSquare, MessageSquare, FileText, Plus } from "lucide-react";
import { cn } from "../lib/utils.js";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../Store/Authantication/authenticationSlice.js";
import { getSnippetById } from "../Store/SnippetSlices/snippetslice.js";

export default function Sidebar({
  
  
  onSnippetCreate,
  currentSnippetId,
}) {
  const [activeTab, setActiveTab] = useState("snippets");
  const{isLoading}= useSelector((state) => state.authenticationSlice)
  const snippets= useSelector((state) => state.snippetSlice.snippets)
  const dispatch=useDispatch()
  const onLogout = () => {
    // Handle logout logic here, e.g., clear user session, redirect to login page, etc.
    dispatch(signOut())
    console.log("User logged out");
  };
  
  function updatedAtData(date){
    const utcDate = new Date(date); // UTC date
const indianStandardTime = new Date(utcDate.getTime() + (5 * 60 + 30) * 60000); // Adding 5 hours 30 minutes
// Format the date in 'MMMM d, yyyy' format
const options = { year: 'numeric', month: 'long', day: 'numeric' };
const formattedDate = indianStandardTime.toLocaleDateString("en-IN", options);
return formattedDate;
  }
  return (
    <div className="w-80 border-r border-gray-800 flex flex-col h-full bg-gray-950">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center">
        <div className="w-8 h-8 relative mr-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
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
        <h1 className="text-xl font-bold">DevVault</h1>
      </div>

      {/* Navigation */}
      <nav className="p-2 space-y-1">
        <button
          className={cn(
            "flex items-center w-full p-3 rounded-md transition-colors",
            activeTab === "snippets" ? "bg-gray-900 text-white" : "text-gray-400 hover:bg-gray-900 hover:text-white "
          )}
          onClick={() => setActiveTab("snippets")}
        >
          <Code className="mr-3 h-5 w-5" />
          Snippets
        </button>

        <button
          className={cn(
            "flex items-center w-full p-3 rounded-md transition-colors",
            activeTab === "tasks" ? "bg-gray-900 text-white" : "text-gray-400 hover:bg-gray-900 hover:text-white"
          )}
          onClick={() => setActiveTab("tasks")}
        >
          <CheckSquare className="mr-3 h-5 w-5" />
          Tasks
        </button>

        <button
          className={cn(
            "flex items-center w-full p-3 rounded-md transition-colors",
            activeTab === "ai" ? "bg-gray-900 text-white" : "text-gray-400 hover:bg-gray-900 hover:text-white"
          )}
          onClick={() => setActiveTab("ai")}
        >
          <MessageSquare className="mr-3 h-5 w-5" />
          AI Assistance
        </button>

        <button
          className={cn(
            "flex items-center w-full p-3 rounded-md transition-colors",
            activeTab === "notes" ? "bg-gray-900 text-white" : "text-gray-400 hover:bg-gray-900 hover:text-white"
          )}
          onClick={() => setActiveTab("notes")}
        >
          <FileText className="mr-3 h-5 w-5" />
          Notes
        </button>
      </nav>

      {/* Snippets List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="flex items-center justify-between mb-2 px-2">
          <h2 className="text-sm font-semibold text-gray-400">RECENT SNIPPETS</h2>
          <button
            onClick={onSnippetCreate}
            className="p-1 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white"
            title="Create new snippet"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-1">
          {snippets?.map((snippet) => (
            <button
              key={snippet.snippet_id}
              className={cn(
                "w-full text-left p-2 rounded-md transition-colors",
                snippet.snippet_id === currentSnippetId ? "bg-gray-800 text-white" : "hover:bg-gray-900 text-gray-300"
              )}
              onClick={() => dispatch(getSnippetById(snippet.snippet_id))}
            >
              <div className="font-medium truncate">{snippet.snippet_title}</div>
              <div className="text-xs text-gray-500">
               Last Updated: {updatedAtData(snippet.updated_at)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={onLogout}
          className="flex items-center w-full p-2 rounded-md text-gray-400 hover:bg-gray-900 hover:text-white transition-colors cursor-pointer "
          type="button"
          disabled={isLoading}
        >
          <LogOut className="mr-3 h-5 w-5" />
          {isLoading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
}
