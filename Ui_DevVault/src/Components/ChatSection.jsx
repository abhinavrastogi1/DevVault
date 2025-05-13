import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

export default function ChatSection({ snippetId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Load messages from localStorage on initial render
  useEffect(() => {
    const savedMessages = localStorage.getItem(`chat-${snippetId}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Add a welcome message
      const welcomeMessage = {
        id: "welcome",
        role: "assistant",
        content: "Hello! I'm your AI assistant. How can I help you with this snippet?",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
      localStorage.setItem(`chat-${snippetId}`, JSON.stringify([welcomeMessage]));
    }
  }, [snippetId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    localStorage.setItem(`chat-${snippetId}`, JSON.stringify(updatedMessages));
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateAIResponse(input.trim()),
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      localStorage.setItem(`chat-${snippetId}`, JSON.stringify(finalMessages));
      setIsLoading(false);
    }, 1000);
  };

  // Simple AI response generator for demo purposes
  const generateAIResponse = (userInput) => {
    const responses = [
      "I've analyzed your code and it looks good. You might want to consider optimizing the algorithm for better performance.",
      "Here's a suggestion: try using a more descriptive variable name to improve code readability.",
      "Your approach is solid. Have you considered adding error handling to make the code more robust?",
      "This looks like a good implementation. You could refactor it to use more modern syntax for better maintainability.",
      "I notice you're working on this algorithm. Have you considered using a different data structure that might be more efficient?",
      "Your code is well-structured. One thing to consider is adding more comments to explain the complex parts.",
      "This is a good start! You might want to add unit tests to ensure everything works as expected.",
      "I see what you're trying to do. Have you considered breaking this down into smaller functions for better readability?",
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">GPT Assistance</h2>

      <div className="h-64 overflow-y-auto mb-4 bg-gray-950 rounded-md p-3">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-200"
                }`}
              >
                <p>{message.content}</p>
                <div className="text-xs opacity-70 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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
          onChange={(e) => setInput(e.target.value)}
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
