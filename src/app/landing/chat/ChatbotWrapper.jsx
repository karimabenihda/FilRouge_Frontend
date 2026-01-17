"use client";

import { useState } from "react";
import Image from "next/image";
import Chatbot from "./Chatbot";

export default function ChatbotWrapper() {
  const [open, setOpen] = useState(false);

  return (
      <>
      <Chatbot  open={open} onClose={() => setOpen(false)} />
      
      <Image
        src="/images/chatbot/elena.png"
        alt="Chatbot"
        width={120}
        height={120}
        className="fixed bottom-4 right-4 z-50 cursor-pointer "
        onClick={() => setOpen(true)}
      />

    </>
  );
}
