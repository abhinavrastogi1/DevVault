import React, { useState, useRef, useEffect, use } from "react";
import { Send } from "lucide-react";
import { useSelector } from "react-redux";
import { useBlocker } from "react-router-dom";

export default function ChatSection({ questions,newQuestionHandler,handleSubmit,newQuestion }) {
  const [messages, setMessages] = useState(questions||[]);
  const [input, setInput] = useState(newQuestion || "");
  const messagesEndRef = useRef(null);
  const{isLoading}=useSelector((state) => state.snippetSlice);
  // Load messages from localStorage on initial render
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  useEffect(() => { setMessages(questions)}, [questions]);
  // Handle input change  
  const handleInput = (value) => {
    newQuestionHandler(value);
  };
  useEffect(() => {
    setInput(newQuestion || "");
  }
, [newQuestion]);
  //Hello! I'm your AI assistant. How can I help you with this snippet?
  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">GPT Assistance</h2>
      <div className="h-64 overflow-y-auto mb-4 bg-gray-950 rounded-md p-3">
        <div className="space-y-4">
          {messages?.map((message) => (
            <div key={message.question_id } className="flex flex-col space-y-2">
              <div className="flex justify-end">
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 bg-blue-600 text-white flex  text-start `}
              >
                <p className="text-start">{message.userquestion }</p>
              </div>
              </div>
              <div className="flex justify-start">
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2   bg-gray-800  text-gray-200`}
              >
                <p>{message.ai_response}</p>
              </div>
            </div>
            </div>

          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 text-gray-200 rounded-lg px-4 py-2">
                <div className="flex space-x-2">
                  <div
                    className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e)=> handleInput(e.target.value)}
          placeholder="Ask AI for help with your snippet..."
          className="flex-1 bg-gray-800 border border-gray-700 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-r-md disabled:opacity-50"
          disabled={!input.trim() || isLoading}
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
