"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Hero from "./landing/Hero";
import Footer from "./landing/Footer";
import Testimoignal from "./landing/Testimoignal";
import Faqs from "./landing/Faqs";
import About from "./landing/About";
import Services from "./landing/Services";
import Cards from "./landing/Cards";
import Exemples from "./landing/Exemples";
import Cta from "./landing/Cta";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const now = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp < now) {
        // Token expiré → logout
        localStorage.removeItem("token");
        router.push("/auth/login");
      }
    } catch {
      // Token malformé → logout
      localStorage.removeItem("token");
      router.push("/auth/login");
    }
  }, []);

  return (
    <>
      <div className="space-y-20">
        <Hero />
        <div className="px-6 md:px-1 space-y-20">
          <About />
          <Cards />
          <Exemples />
          <Faqs />
          <Testimoignal />
          <Cta />
        </div>
        <Footer />
      </div>
    </>
  );
}