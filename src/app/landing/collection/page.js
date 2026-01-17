"use client"
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Search, ShoppingCart } from "react-feather";

const products = [
  { id: 1, name: "Nasa Elite Chair", price: 299, img: "/images/chairs/black1.png", rating: 4.5 },
  { id: 2, name: "Serenity Seat", price: 179, img: "/images/chairs/orange1.png", rating: 4 },
  { id: 3, name: "Lounge Chair", price: 249, img: "/images/chairs/black2.png", rating: 4.2 },
  { id: 4, name: "Aurora Edge Chair", price: 349, img: "/images/chairs/white1.png", rating: 5 },
  { id: 5, name: "Century Chair", price: 199, img: "/images/chairs/gray1.png", rating: 4 },
  { id: 6, name: "Harmony Chair", price: 279, img: "/images/chairs/brown1.png", rating: 3.8 },
  { id: 7, name: "Rustic Retreat Chair", price: 319, img: "/images/chairs/black3.png", rating: 4.1 },
  { id: 8, name: "Zenith Chair", price: 229, img: "/images/chairs/black4.png", rating: 4.3 },
  { id: 9, name: "Verona Delight Chair", price: 389, img: "/images/chairs/gray2.png", rating: 4.6 },
];

export default function ChairsPage() {
  const [sort, setSort] = useState("popularity");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const categories = [
    "Accent Chairs", "Armchairs", "Dining Chairs",
    "Office Chairs", "Lounge Chairs", "Outdoor Chairs",
    "Bean Bag Chairs", "Convertible Chairs"
  ];

  const mainFilters = ["Brand", "Color", "Price"];

  return (
    <div className="px-4 md:px-16">

      {/* Navbar */}
      <nav className="flex flex-col py-3 md:flex-row items-center justify-between px-4 md:px-8  bg-white border-b border-gray-100 gap-4 md:gap-0">
        <div className="flex items-center gap-4 md:gap-8 w-full md:w-auto justify-between">
           <button 
            className="md:hidden cursor-pointer -ml-3 p-2 bg-gray-100 rounded-md" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰ 
          </button>

            <button className="flex items-center gap-1 text-gray-700 hover:text-black font-medium transition-colors">
              Category
              <ChevronDown size={18} />
            </button>
            <a href="#" className="text-gray-700 hover:text-black font-medium transition-colors">
              Most Wanted
            </a>
            <a href="#" className="text-gray-700 hover:text-black font-medium transition-colors">
              What's New
            </a>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="relative w-full  md:w-50">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search furniture"
              className="pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-full focus:outline-none focus:bg-white focus:border-gray-200 w-full transition-all"
            />
          </div>
          <button className="text-gray-700 hover:text-black transition-colors">
            <ShoppingCart size={22} />
          </button>
          <Button>Login</Button>
        </div>
      </nav>

      {/* Hero Image */}
      <div className="relative w-full mb-5 mx-auto overflow-hidden rounded-2xl">
        <img
          src="/images/bg/retro.jpg"
          alt="Retro Furniture"
          className="w-full h-auto object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-end p-8 md:p-16 text-right">
          <div className="max-w-md">
            <h1 className="text-white text-xl md:text-2xl drop-shadow-lg">
              Explore the world of the furniture's home from Elan
            </h1>
          </div>
        </div>
      </div>

      {/* Sort */}
      <div className="flex flex-col md:flex-row justify-end items-center mb-8 gap-4 md:gap-2">
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-gray-600">Sort by:</label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-gray-300 rounded-lg p-2"
          >
            <option value="popularity">Popularity</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-6">

        {/* Sidebar for Desktop */}
        <div className="hidden md:block w-64 bg-white p-4 font-sans">
          <SidebarContent categories={categories} mainFilters={mainFilters} />
        </div>

        {/* Sidebar Drawer for Mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 bg-black/30 flex">
            <div className="w-64 bg-white p-4 font-sans h-full">
              <button className="mb-4 text-gray-600" onClick={() => setSidebarOpen(false)}>
                Close ✕
              </button>
              <SidebarContent categories={categories} mainFilters={mainFilters} />
            </div>
            <div className="flex-1" onClick={() => setSidebarOpen(false)}></div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
          {products.map((product) => (
            <div key={product.id} className="border rounded-xl p-4 flex flex-col items-center bg-white shadow-sm hover:shadow-md transition">
              <img src={product.img} alt={product.name} className="h-40 w-full object-cover rounded-lg mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">{product.name}</h3>
              <p className="text-gray-600 mb-2">${product.price}</p>
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className={`text-yellow-400 ${i < Math.floor(product.rating) ? "opacity-100" : "opacity-30"}`}>★</span>
                ))}
              </div>
              <Button className="w-full bg-[#c8ad93] text-white hover:bg-[#e3c6a0]">Add to Cart</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Sidebar content as a component to reuse for mobile & desktop
function SidebarContent({ categories, mainFilters }) {
  return (
    <>
      <div className="flex items-center justify-between bg-[#F3F5F7] p-3 rounded-lg mb-4 cursor-pointer">
        <span className="text-gray-700 font-medium">Category</span>
        <ChevronRight size={18} className="text-gray-500" />
      </div>

      <div className="space-y-1 ml-2 mb-8">
        {categories.map((item) => (
          <div
            key={item}
            className="flex items-center justify-between py-2 px-2 hover:bg-gray-50 rounded-md cursor-pointer group"
          >
            <span className="text-gray-600 text-sm group-hover:text-black transition-colors">{item}</span>
            <ChevronDown size={14} className="text-gray-400" />
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 pt-4 space-y-4">
        {mainFilters.map((filter) => (
          <div key={filter} className="flex items-center justify-between py-2 px-2 cursor-pointer">
            <span className="text-gray-800 font-medium">{filter}</span>
            <ChevronDown size={18} className="text-gray-600" />
          </div>
        ))}
      </div>
    </>
  );
}
