"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState, useRef, useEffect } from "react";

const API_BASE = "http://127.0.0.1:8000";

export default function Chatbot({ open, onClose }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Bonjour ! Je suis Elena, votre assistante ÉLAN. Comment puis-je vous aider ?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (!open) return null;

  // ── POST /chat ──────────────────────────────────────────────────────────────
  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    // Ajouter le message utilisateur
    setMessages(prev => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
      });

      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      const data = await res.json();

      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Une erreur est survenue. Veuillez réessayer ou contacter notre service client.",
        error: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  // ── DELETE /reset ───────────────────────────────────────────────────────────
  const resetConversation = async () => {
    try {
      await fetch(`${API_BASE}/reset`, { method: "DELETE" });
    } catch (err) {
      console.error("Reset failed:", err);
    }
    setMessages([
      { role: "assistant", content: "Conversation réinitialisée. Comment puis-je vous aider ?" }
    ]);
  };

  // Send on Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-[120px] right-6 z-50">
      <div className="bg-gray-100 w-[380px] h-[520px] rounded-2xl shadow-xl flex flex-col overflow-hidden">

        {/* ── Header ── */}
        <div className="bg-[#1e3753] px-4 py-3 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="font-medium">Elena — ÉLAN</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Reset button */}
            <button
              onClick={resetConversation}
              title="Réinitialiser la conversation"
              className="text-white/60 hover:text-white transition-colors p-1 rounded"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
              </svg>
            </button>
            {/* Close button */}
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors p-1 rounded"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ── Messages ── */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`p-3 rounded-2xl max-w-[80%] text-sm leading-relaxed whitespace-pre-wrap
                  ${msg.role === "user"
                    ? "bg-[#c8ad93] text-black rounded-tr-none"
                    : msg.error
                      ? "bg-red-100 text-red-700 rounded-tl-none"
                      : "bg-[#1e3753] text-white rounded-tl-none"
                  }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#1e3753] text-white p-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* ── Input ── */}
        <div className="bg-white p-3 flex items-center gap-2 border-t border-gray-200 shrink-0">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Écrivez votre message..."
            disabled={loading}
            className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3753]"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-[#c8ad93]  hover:bg-[#b89d83] rounded-full p-2 shrink-0  "
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11.5 12H5.4M5.25 12.8l-1 3C3.69 17.44 3.42 18.26 3.61 18.77c.17.44.54.78.99.9.52.15 1.31-.2 2.9-.92L17.64 14.19c1.54-.7 2.31-1.04 2.55-1.52.2-.42.2-.93 0-1.35-.24-.48-1.01-.83-2.55-1.52L7.48 5.24C5.91 4.53 5.12 4.18 4.6 4.32c-.45.13-.82.46-.99.9-.2.51.07 1.33.61 2.97l1.03 3.09c.09.28.14.42.16.56.02.13.02.26 0 .39-.02.14-.07.28-.16.56z"/>
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}