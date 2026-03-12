"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import axios from "axios";

import { ShieldAlert } from "lucide-react";

const AdminGuard = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null);
  const [animationData, setAnimationData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("user_role");
    const token = localStorage.getItem("token");

    if (!token || role !== "admin") {
      setIsAdmin(false);
      // Fetch a stable lock animation
      fetch("https://assets10.lottiefiles.com/packages/lf20_at6p77j3.json")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load animation");
          return res.json();
        })
        .then((data) => setAnimationData(data))
        .catch((err) => {
          console.error("Lottie load error:", err);
        });
    } else {
      setIsAdmin(true);
    }
  }, []);

  if (isAdmin === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1e3753]"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="w-full max-w-[300px] flex justify-center mb-6">
          {animationData ? (
            <Lottie animationData={animationData} loop={true} />
          ) : (
            <div className="p-8 bg-red-50 rounded-full">
              <ShieldAlert size={80} className="text-red-500" />
            </div>
          )}
        </div>
        <h1 className="text-4xl font-extrabold text-[#1e3753] tracking-tight">Access Denied</h1>
        <p className="text-slate-500 mt-4 text-center max-w-sm text-lg leading-relaxed">
          This area is restricted to administrators. Please use an authorized account to continue.
        </p>
        <div className="flex gap-4 mt-10">
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-white transition-all font-medium"
          >
            Back to Home
          </button>
          <button
            onClick={() => router.push("/auth/login")}
            className="px-8 py-2.5 bg-[#1e3753] text-white rounded-lg hover:bg-[#2a4a6d] hover:shadow-lg transition-all font-semibold"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminGuard;
