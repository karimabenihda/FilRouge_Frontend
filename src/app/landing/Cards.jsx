import { Button } from "@/components/ui/button";
import React, { useState } from "react";

function Cards() {
    const [activeCard, setActiveCard] = useState("living"); // default open

  const cards = [
    {
      id: "living",
      title: "Living Room",
      text: "Sofas and tables designed for comfort and shared moments.",
      label: "Comfort & Style",
      img: "/images/pic3.jfif",
      gradient: "from-black/80 via-black/40 to-transparent",
    },
    {
      id: "office",
      title: "Office",
      text: "Smart furniture built for focus and productivity.",
      label: "Work Smart",
      img: "/images/pic2.jfif",
      gradient: "from-[#1e3753]/90 via-[#1e3753]/50 to-transparent",
    },
    {
      id: "bedroom",
      title: "Bedroom",
      text: "Calm, cozy pieces for better rest and relaxation.",
      label: "Rest & Relax",
      img: "/images/pic4.jfif",
      gradient: "from-black/80 via-black/40 to-transparent",
    },
  ];
  return (
    <div className="flex items-center justify-center ">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN */}
        <div className="space-y-6">

          {/* Dining & Kitchen */}
          <div className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl bg-[#c8ad93]/30">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-[#1e3753]">
                Dining & Kitchen
              </h2>
              <p className="mt-2 text-[#1e3753]/80 text-sm leading-relaxed">
                Elegant dining tables and kitchen furniture designed for
                everyday meals and family moments.
              </p>
            </div>

            <div className="flex-1">
              <img
                src="/images/pic4.jfif"
                alt="dining furniture"
                className="rounded-xl object-cover w-full h-48"
              />
            </div>
          </div>

          {/* Bottom Cards */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-6">

            {/* Decor */}
            <div className="p-5 rounded-2xl bg-[#c8ad93]/30">
              <h2 className="text-lg font-semibold text-[#1e3753]">
                Decor
              </h2>
              <p className="mt-2 text-[#1e3753]/80 text-sm">
                Finishing touches that bring warmth and character.
              </p>
              <img
                src="/images/books.png"
                alt="decor"
                className="mt-4  object-cover w-full "
              />
            </div>

            {/* Promo */}
            <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-[#c8ad93]/30 text-center">
              <Button className="mb-4">Discover</Button>
              <h2 className="text-lg font-semibold text-[#1e3753]">
                Up to 30% on Bedroom & Office
              </h2>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE – EXPANDING CARDS */}
   <div className="lg:col-span-2 flex gap-6 h-[510px]">
      {cards.map((card) => (
        <div
          key={card.id}
          onMouseEnter={() => setActiveCard(card.id)}
          onMouseLeave={() => setActiveCard(card.id === "living" ? "living" : "")} 
          className={`relative rounded-2xl overflow-hidden transition-all duration-500
            ${activeCard === card.id ? "flex-[3]" : "flex-[1]"}`}
        >
          <img
            src={card.img}
            alt={card.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div
            className={`absolute inset-0 flex flex-col justify-end p-8
            bg-gradient-to-t ${card.gradient}
            transition-opacity duration-300
            ${activeCard === card.id ? "opacity-100" : "opacity-0"}`}
          >
            <h2 className="text-2xl font-semibold text-white">{card.title}</h2>
            <p className="mt-2 text-sm text-white/80 max-w-sm">{card.text}</p>
            <span className="mt-4 text-xs bg-white/90 text-[#1e3753] px-4 py-1 rounded-full w-fit">
              {card.label}
            </span>
          </div>
        </div>
      ))}
    </div>


      </div>
    </div>
  );
}

export default Cards;
