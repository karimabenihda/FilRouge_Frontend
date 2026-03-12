"use client";

import { useEffect, useState } from "react";
import Spinner from "./spinner";

export default function ClientRootLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
       setTimeout(() => setShowContent(true), 50); 
    }, 2000);  
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* {loading && <Spinner />} */}
       <div
        // className={`transition-all duration-700 ease-out 
        //   ${showContent ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"}`}
      >
        {!loading && children}
      </div>
    </>
  );
}
