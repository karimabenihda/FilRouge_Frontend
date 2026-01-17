import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState } from "react";

function Exemples() {
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentCategory, setCurrentCategory] = useState("Living");

  // Slides & content per category
  const categories = {
    Living: {
      slides: [
        "/images/exempls/sofa.jfif",
        "/images/exempls/living.jpg",
        "/images/exempls/living.jpg",
      ],
      title: "Living Room Collection",
      description:
        "Explore our modern and cozy living room furniture, designed to bring comfort and style to your home.",
    },
    Bedroom: {
      slides: [
        "/images/exempls/bed1.jpg",
        "/images/exempls/bed2.jpg",
        "/images/exempls/bed3.jpg",
      ],
      title: "Bedroom Collection",
      description:
        "Transform your bedroom into a serene retreat with elegant beds, nightstands, and cozy decor.",
    },
    Kitchen: {
      slides: [
        "/images/exempls/kitchen1.jpg",
        "/images/exempls/kitchen2.jpg",
        "/images/exempls/kitchen3.jpg",
      ],
      title: "Kitchen & Dining Collection",
      description:
        "Modern dining sets and kitchen furniture that make cooking and entertaining a delightful experience.",
    },
    Office: {
      slides: [
        "/images/exempls/office1.jpg",
        "/images/exempls/office2.jpg",
        "/images/exempls/office3.jpg",
      ],
      title: "Home Office Collection",
      description:
        "Create a productive workspace with sleek desks, ergonomic chairs, and smart storage solutions.",
    },
    Decor: {
      slides: [
        "/images/exempls/decor1.jpg",
        "/images/exempls/decor2.jpg",
        "/images/exempls/decor3.jpg",
      ],
      title: "Home Decor Collection",
      description:
        "Add personality and style to your home with elegant rugs, lighting, and decorative accessories.",
    },
  
  };

  const slideData = categories[currentCategory].slides;
  const { title, description } = categories[currentCategory];

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideData.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slideData]);

  // Reset slide when category changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [currentCategory]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Categories */}
      <div className="flex justify-end mb-4">
        <div className="flex flex-wrap gap-2">
          {Object.keys(categories).map((cat, i) => (
            <Button
              key={i}
              onClick={() => setCurrentCategory(cat)}
              className={`px-5 py-2 rounded-full text-[#1e3753] bg-transparent hover:bg-[#1e3753] hover:text-white transition ${
                currentCategory === cat ? "bg-[#1e3753] text-white" : ""
              }`}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center mb-10">
        {/* Text Card */}
        <div className="bg-[#1e3753] text-white p-6 h-64 rounded-2xl">
          <h1 className="text-3xl font-semibold mb-2">
            Modern Furniture for Your Home
          </h1>
          <p className="text-sm text-gray-200 leading-relaxed mb-5">
            Discover elegant and comfortable furniture designed to make your home warm, stylish, and functional.
          </p>
          <Button>Explore</Button>
        </div>

        {/* Image 1 */}
        <div className="rounded-2xl overflow-hidden">
          <img src={slideData[0]} alt="furniture" className="w-full h-64 object-cover" />
        </div>

        {/* Image 2 */}
        <div className="rounded-2xl overflow-hidden">
          <img src={slideData[1]} alt="furniture" className="w-full h-64 object-cover" />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Slider */}
        <div className="w-full max-w-4xl mx-auto rounded-3xl overflow-hidden relative group">
          <div
            ref={sliderRef}
            className="h-full flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slideData.map((src, index) => (
              <div key={index} className="min-w-full relative aspect-[16/9] md:aspect-[21/9]">
                <img src={src} alt={`${currentCategory} Design ${index + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            ))}
          </div>
        </div>

        {/* Category Card */}
        <div className="rounded-2xl overflow-hidden">
          <div className="bg-[#1e3753] text-white p-8 rounded-2xl h-64">
            <h1 className="text-3xl font-semibold mb-4">{title}</h1>
            <p className="text-sm text-gray-200 leading-relaxed mb-6">{description}</p>
            <Button>Explore the Collection</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Exemples;
