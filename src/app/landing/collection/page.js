"use client"

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Search, ShoppingCart } from "react-feather";
import { useRouter } from "next/navigation";
import ClientNav from  "../../navigation/ClientNav"


export default function ChairsPage() {
  const router = useRouter();

  const [sort, setSort] = useState("popularity");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNavFilter, setActiveNavFilter] = useState(null); // "mostWanted" | "whatsNew" | null

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [priceRange, setPriceRange] = useState(null);

  const getHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const mainFilters = ["Brand", "Color", "Price"];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const headers = getHeaders();
    try {
      const [furnRes, catRes, subRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/furnitures/furnitures", { headers }),
        axios.get("http://127.0.0.1:8000/api/furnitures/categories", { headers }),
        axios.get("http://127.0.0.1:8000/api/furnitures/subcategories", { headers })
      ]);

      setProducts(furnRes.data);
      setCategories(catRes.data);
      setSubcategories(subRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Handle nav filter toggle — clicking the active one deselects it
  const handleNavFilter = (filter) => {
    setActiveNavFilter((prev) => (prev === filter ? null : filter));
    // Reset category/subcategory filters when switching nav filters
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setPriceRange(null);
    setSearchQuery("");
  };

  const filteredProducts = products
    .filter((product) => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const nameMatch = product.ProductName?.toLowerCase().includes(query);
        const descMatch = product.description?.toLowerCase().includes(query);
        if (!nameMatch && !descMatch) return false;
      }

      // Category filter
      let categoryFilter = true;
      let subFilter = true;
      let priceFilter = true;

      if (selectedCategory) {
        const subIds = subcategories
          .filter(sub => sub.category_id === selectedCategory)
          .map(sub => sub.id);
        categoryFilter = subIds.includes(product.subcategory_id);
      }

      if (selectedSubcategory) {
        subFilter = product.subcategory_id === selectedSubcategory;
      }

      if (priceRange && priceRange.label !== "All") {
        priceFilter = product.price >= priceRange.min && product.price <= priceRange.max;
      }

      return categoryFilter && subFilter && priceFilter;
    })
    .sort((a, b) => {
      // "Most Wanted": sort by sold_count, then rating, then fallback to 0
      if (activeNavFilter === "mostWanted") {
        const soldA = a.sold_count ?? a.soldCount ?? 0;
        const soldB = b.sold_count ?? b.soldCount ?? 0;
        if (soldB !== soldA) return soldB - soldA;
        return (b.rating ?? 0) - (a.rating ?? 0);
      }

      // "What's New": sort by created_at descending (newest first)
      if (activeNavFilter === "whatsNew") {
        const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
        const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
        return dateB - dateA;
      }

      // Default sort dropdown
      if (sort === "priceLow") return a.price - b.price;
      if (sort === "priceHigh") return b.price - a.price;
      return 0;
    });

  // "Most Wanted" slice: show top 12 best sellers when filter is active
  const displayedProducts =
    activeNavFilter === "mostWanted"
      ? filteredProducts.slice(0, 12)
      : activeNavFilter === "whatsNew"
      ? filteredProducts.slice(0, 12)
      : filteredProducts;

const handleAddToCart = async (product) => {
  const token = localStorage.getItem("token");

  if (!token) {
    router.push("/auth/login");
    return;
  }

  const payload = JSON.parse(atob(token.split(".")[1]));
  const customerId = payload.user_id;

  localStorage.setItem("user_id",    payload.user_id);
  localStorage.setItem("user_email", payload.sub);
  localStorage.setItem("user_role",  payload.role);

  try {
    await axios.post(
      "http://127.0.0.1:8000/api/sales/add",   // ← lowercase 's'
      {
        product_id:  product.ProductID,
        customer_id: customerId,
        quantity:    1,
        subtotal:    product.price,
        discount:    0.0,
      },
      { headers: getHeaders() }
    );

    window.dispatchEvent(new Event("cartUpdated"));

    setCart((prev) => {
      const existing = prev.find((i) => i.ProductID === product.ProductID);
      if (existing) {
        return prev.map((i) =>
          i.ProductID === product.ProductID ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });

  } catch (error) {
    console.error("Failed to add to cart:", error.response?.data || error.message);
  }
};
    // Redundant cart count logic removed as ClientNav handles it
    // const CartIcon = () => (
    //     <a href="/landing/cart" className="relative cursor-pointer">
    //         <svg width="18" height="18" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    //             <path d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0" stroke="#060e19" strokeLinecap="round" strokeLinejoin="round" />
    //         </svg>
    //         {cartCount > 0 && (
    //             <span className="absolute -top-2 -right-3 text-xs text-white bg-[#c8ad93] w-[18px] h-[18px] rounded-full flex items-center justify-center">
    //                 {cartCount > 99 ? '99+' : cartCount}
    //             </span>
    //         )}
    //     </a>
    // )
  return (
    <div className="px-4 md:px-16">

      {/* Navbar */}
     <ClientNav/>
 <nav className="flex flex-col md:flex-row py-3 items-center justify-between bg-white border-b border-gray-100 gap-4 md:gap-0 px-4 md:px-8">
        <div className="flex items-center gap-4 md:gap-8 w-full md:w-auto justify-between">

          <button
            className="md:hidden cursor-pointer -ml-3 p-2 bg-gray-100 rounded-md"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>

          {/* Category Dropdown */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              className="flex items-center gap-1 text-gray-700 hover:text-black font-medium transition-colors"
              onClick={() => setCategoryOpen(!categoryOpen)}
            >
              Category
              <ChevronDown size={18} />
            </button>

            {categoryOpen && (
              <div className="absolute top-8 left-0 bg-white border border-gray-100 rounded-xl shadow-lg z-50 min-w-40">
                <div
                  onClick={() => { setSelectedCategory(null); setSelectedSubcategory(null); setCategoryOpen(false); }}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-black hover:bg-gray-50 cursor-pointer rounded-t-xl"
                >
                  All Categories
                </div>
                {categories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setSelectedSubcategory(null);
                      setCategoryOpen(false);
                    }}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-black hover:bg-gray-50 cursor-pointer last:rounded-b-xl"
                  >
                    {category.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Most Wanted — toggles active filter */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); handleNavFilter("mostWanted"); }}
            className={`font-medium transition-colors ${
              activeNavFilter === "mostWanted"
                ? "text-[#c8ad93] underline underline-offset-4"
                : "text-gray-700 hover:text-black"
            }`}
          >
            Most Wanted
          </a>

          {/* What's New — toggles active filter */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); handleNavFilter("whatsNew"); }}
            className={`font-medium transition-colors ${
              activeNavFilter === "whatsNew"
                ? "text-[#c8ad93] underline underline-offset-4"
                : "text-gray-700 hover:text-black"
            }`}
          >
            What's New
          </a>
        </div>

        <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
          <div className="relative w-full md:w-50">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search furniture"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                // Clear nav filters when user starts searching
                if (e.target.value.trim()) setActiveNavFilter(null);
              }}
              className="pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-full focus:outline-none focus:bg-white focus:border-gray-200 w-full transition-all"
            />
          </div>
  
        </div>
      </nav>
      {/* Hero */}
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

      {/* Active filter label */}
      {(activeNavFilter || searchQuery.trim()) && (
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
          {activeNavFilter === "mostWanted" && <span>Showing: <strong>Most Wanted</strong> products</span>}
          {activeNavFilter === "whatsNew" && <span>Showing: <strong>What's New</strong> products</span>}
          {searchQuery.trim() && <span>Showing results for: <strong>"{searchQuery}"</strong></span>}
          <button
            onClick={() => { setActiveNavFilter(null); setSearchQuery(""); }}
            className="ml-2 text-[#c8ad93] hover:underline"
          >
            Clear
          </button>
        </div>
      )}

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

      {/* Main */}
      <div className="flex flex-col md:flex-row gap-6">

        {/* Sidebar desktop */}
        <div className="hidden md:block w-64 bg-white p-4 font-sans">
          <SidebarContent
            categories={categories}
            subcategories={subcategories}
            mainFilters={mainFilters}
            setSelectedSubcategory={setSelectedSubcategory}
            setSelectedCategory={setSelectedCategory}
            setPriceRange={setPriceRange}
          />
        </div>

        {/* Sidebar mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 bg-black/30 flex">
            <div className="w-64 bg-white p-4 font-sans min-h-screen overflow-y-auto">
              <button
                className="mb-4 text-gray-600"
                onClick={() => setSidebarOpen(false)}
              >
                Close ✕
              </button>
              <SidebarContent
                categories={categories}
                subcategories={subcategories}
                mainFilters={mainFilters}
                setSelectedSubcategory={setSelectedSubcategory}
                setSelectedCategory={setSelectedCategory}
                setPriceRange={setPriceRange}
              />
            </div>
            <div className="flex-1" onClick={() => setSidebarOpen(false)}></div>
          </div>
        )}

        {/* Products */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
          {displayedProducts.length > 0 ? (
            displayedProducts.map((product) => (
              <div
                key={product.ProductID}
                className="border rounded-xl p-4 flex flex-col items-center bg-white shadow-sm hover:shadow-md transition w-full self-start"
              >
                <img
                  src={product.image}
                  alt={product.ProductName}
                  className="h-40 w-full object-cover rounded-lg mb-4"
                />
                <h3 className="text-lg font-medium text-gray-900 mb-1 text-center">{product.ProductName}</h3>
                <p className="text-gray-600 mb-2">${product.price}</p>
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <Button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-[#c8ad93] text-white hover:bg-[#e3c6a0]"
                >
                  Add to Cart
                </Button>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">No products found for selected filters</p>
          )}
        </div>

      </div>
    </div>
  );
}

function SidebarContent({ categories, subcategories, mainFilters, setSelectedSubcategory, setSelectedCategory, setPriceRange }) {

  const [openCategory, setOpenCategory] = useState(null);

  const priceRanges = [
    { label: "All", min: 0, max: Infinity },
    { label: "Under $100", min: 0, max: 100 },
    { label: "$100 - $300", min: 100, max: 300 },
    { label: "$300 - $600", min: 300, max: 600 },
    { label: "Above $600", min: 600, max: Infinity }
  ];

  const toggleCategory = (id) => setOpenCategory(openCategory === id ? null : id);

  return (
    <>
      <div className="flex items-center justify-between bg-[#F3F5F7] p-3 rounded-lg mb-4 cursor-pointer">
        <span className="text-gray-700 font-medium">Category</span>
        <ChevronRight size={18} className="text-gray-500" />
      </div>

      <div className="space-y-1 ml-2 mb-8">
        {categories.map((category) => (
          <div key={category.id}>
            <div
              onClick={() => {
                toggleCategory(category.id);
                setSelectedCategory(category.id);
                setSelectedSubcategory(null);
              }}
              className="flex items-center justify-between py-2 px-2 hover:bg-gray-50 rounded-md cursor-pointer group"
            >
              <span className="text-gray-600 text-sm group-hover:text-black transition-colors">{category.name}</span>
              {openCategory === category.id ? (
                <ChevronDown size={14} className="text-gray-400" />
              ) : (
                <ChevronRight size={14} className="text-gray-400" />
              )}
            </div>

            {openCategory === category.id && (
              <div className="ml-4 space-y-1">
                {subcategories.filter(sub => sub.category_id === category.id).map(sub => (
                  <div
                    key={sub.id}
                    onClick={() => setSelectedSubcategory(sub.id)}
                    className="py-1 px-2 text-sm text-gray-500 hover:text-black cursor-pointer"
                  >
                    {sub.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 pt-4 space-y-4">
        {mainFilters.map(filter => (
          <div key={filter} className="flex items-center justify-between py-2 px-2 cursor-pointer">
            <span className="text-gray-800 font-medium">{filter}</span>
            <ChevronDown size={18} className="text-gray-600" />
          </div>
        ))}

        <div className="mt-2 space-y-2">
          {priceRanges.map(range => (
            <div
              key={range.label}
              onClick={() => setPriceRange(range)}
              className="text-sm text-gray-600 hover:text-black cursor-pointer px-2"
            >
              {range.label}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}