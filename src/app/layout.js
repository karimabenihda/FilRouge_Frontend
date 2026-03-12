import { Bodoni_Moda, DM_Sans } from "next/font/google";
import "./globals.css";
import ClientRootLayout from "./react-bits/ClientRootLayout";
// import ClientRootLayout from "./client-root-layout";
 import ChatbotWrapper from "./landing/chat/ChatbotWrapper";
 
const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bodoni",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm",
});

export const metadata = {
  title: "Elan",
  description:
    "Discover stylish and comfortable furniture to make your house feel like home. From cozy sofas to elegant dining sets, we bring quality and design together for every corner of your living space.",
  icons: {
    icon: "/images/logo/elan.ico",
  },
};

import { Toaster } from "@/components/ui/sonner";

export default function Layout({ children }) {
 
  return (
    <html lang="en">
      <body className={`${bodoni.variable} ${dmSans.variable}  `}>
                 <ChatbotWrapper />
         <ClientRootLayout>{children}</ClientRootLayout>
         <Toaster />
      </body>
    </html>
  );
}
