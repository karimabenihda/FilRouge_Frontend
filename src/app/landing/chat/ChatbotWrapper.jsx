"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Chatbot from "./Chatbot";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";

function getUserRole() {
  try {
    // Adapt the key name to match yours (localStorage or cookie)
    const token = localStorage.getItem("token");
    if (!token) return null;

    // Decode JWT payload (base64) — no signature verification needed client-side
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role ?? null;
  } catch {
    return null;
  }
}

export default function ChatbotWrapper() {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    setRole(getUserRole());
  }, []);

  // ── Hide on admin routes ───────────────────────────────────────────────────
  if (pathname?.startsWith("/admin")) return null;

  // ── Hide if user is admin ──────────────────────────────────────────────────
  if (role === "admin") return null;

return (
  <>
    <Chatbot open={open} onClose={() => setOpen(false)} />

    <div className="fixed bottom-6 right-6 z-49 group flex flex-col items-end">
      {/* Speech Bubble */}
      <div className="relative mb-3 mr-2 px-6 py-2.5 bg-[#1e3753] text-white text-xs rounded-2xl rounded-br-none shadow-lg group-hover:opacity-100 transition-opacity flex items-center gap-2">
        <span className="font-medium">Ask Elena!</span>
        <Sparkles 
          size={16} 
          className="text-[#c8ad93] animate-pulse fill-[#c8ad93]/20" 
        />
        {/* Subtle bounce animation wrapper */}
        <div className="absolute inset-0 -z-10 animate-bounce bg-[#1e3753] rounded-2xl rounded-br-none opacity-50 blur-sm"></div>
      </div>

      {/* Chatbot Image Container */}
      <div className="relative">
        <Image
          src="/images/chatbot/elena.png"
          alt="Chatbot"
          width={135} 
          height={135}
          className="cursor-pointer hover:scale-110 transition-transform duration-300 drop-shadow-2xl rounded-full"
          onClick={() => setOpen(true)}
        />
        
        {/* Online Indicator */}
        <span className="absolute bottom-1 right-3 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white"></span>
        </span>
      </div>
    </div>
  </>
);
}