"use client"
import Image from "next/image";
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
  return (
   
        <>
  
        <div className="space-y-20  ">
              <Hero/> 
  <div className="px-6 md:px-1 space-y-20">
 
        <About/>
        <Cards/>
        <Exemples/>
        <Faqs/>
        <Testimoignal/>
        <Cta/>
  </div>
  
      <Footer/>
        </div>
        </>


  );
}
