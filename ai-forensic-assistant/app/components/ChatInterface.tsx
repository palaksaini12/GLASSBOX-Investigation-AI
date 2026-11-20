"use client";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send, Loader2 } from "lucide-react";

type Message = {
  role: "user" | "ai";
  content: string;
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Hello Investigator. Upload case files or ask me a query." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Naya message aate hi chat ko automatic niche scroll karna
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Member 3 ke FastAPI Backend ko question bhejna
      const response = await axios.post("http://localhost:8000/api/investigate", {
        query: userMsg.content,
      });

      const aiMsg: Message = { role: "ai", content: response.data.response };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Error connecting to AI Brain." },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-forensic-panel rounded-lg p-4 shadow-lg border border-gray-800">
      {/* Chat History Area */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`p-3 rounded-lg max-w-[80%] ${
                msg.role === "user"
                  ? "bg-forensic-primary text-white"
                  : "bg-gray-800 text-forensic-text"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-gray-400 flex items-center">
            <Loader2 className="animate-spin mr-2" /> AI is analyzing evidence...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about suspect connections..."
          className="flex-1 p-3 rounded-md bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-forensic-primary"
        />
        <button
          onClick={sendMessage}
          className="bg-forensic-primary p-3 rounded-md hover:bg-blue-600 transition"
        >
          <Send className="text-white" />
        </button>
      </div>
    </div>
  );
}