"use client"
import React, { useState, useEffect } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ClientNav from '@/app/navigation/ClientNav';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import ChevronDown  from 'lucide-react'

const page = () => {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coupon, setCoupon] = useState("");
  const [customerId, setCustomerId] = useState(null);

  const itemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.subtotal, 0);
  const shipping = 0.00;
  const taxes = subtotal * 0.00;
  const discount = items.reduce((acc, item) => acc + (item.discount || 0), 0);
  const total = subtotal + shipping + taxes - discount;

  // ──────────────── GET CUSTOMER ID FROM LOCALSTORAGE ────────────────
  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      router.push("/auth/login");
      return;
    }
    setCustomerId(parseInt(userId));
  }, []);

  // ──────────────── FETCH CART WHEN CUSTOMER ID IS READY ────────────────
  useEffect(() => {
    if (customerId) fetchCart();
  }, [customerId]);

  // ──────────────── FETCH CART ────────────────
  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://127.0.0.1:8000/api/Sales/${customerId}`);
      setItems(res.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setItems([]);
      } else {
        console.error("Failed to fetch cart:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  // ──────────────── UPDATE QUANTITY ────────────────
  const updateQuantity = async (item, delta) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) return;

    // Compute unit price from current subtotal/quantity
    const unitPrice = item.product?.price ?? (item.subtotal / item.quantity);

    try {
      await axios.put(`http://127.0.0.1:8000/api/Sales/update/${item.id}`, {
        quantity: newQty,
        subtotal: 0,        // backend recalculates
        discount: item.discount
      });
      setItems(prev =>
        prev.map(i =>
          i.id === item.id
            ? { ...i, quantity: newQty, subtotal: newQty * unitPrice }
            : i
        )
      );
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  // ──────────────── REMOVE ITEM ────────────────
  const removeItem = async (cartItemId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/Sales/remove/${cartItemId}`);
      setItems(prev => prev.filter(i => i.id !== cartItemId));
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  // ──────────────── CLEAR CART ────────────────
  const clearCart = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/Sales/clear/${customerId}`);
      setItems([]);
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  return (
    <div>
      <ClientNav />
 {/* <nav className="flex flex-col md:flex-row py-3 items-center justify-between bg-white border-b border-gray-100 gap-4 md:gap-0 px-4 md:px-8">
        <div className="flex items-center gap-4 md:gap-8 w-full md:w-auto justify-between">

          <button
            className="md:hidden cursor-pointer -ml-3 p-2 bg-gray-100 rounded-md"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>

     
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

          <a href="#" className="text-gray-700 hover:text-black font-medium transition-colors">Most Wanted</a>
          <a href="#" className="text-gray-700 hover:text-black font-medium transition-colors">What's New</a>
        </div>

        <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
          <div className="relative w-full md:w-50">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search furniture"
              className="pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-full focus:outline-none focus:bg-white focus:border-gray-200 w-full transition-all"
            />
          </div>
                          <CartIcon />

         <a href='/landing/cart' className="text-gray-700 hover:text-black transition-colors relative">
  <ShoppingCart size={24} />
  {cart.length > 0 && (
    <span className="absolute -top-2 -right-2 bg-[#c8ad93] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
      {cart.reduce((total, item) => total + item.qty, 0)}
    </span>
  )}
</a>
          <Button>
            <a href="/auth/login">Login</a>
          </Button>
        </div>
      </nav> */}
      <div className="bg-gray-50 min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-8 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">

              <header className="w-full py-4 md:py-6 text-center relative overflow-hidden border-b border-gray-100">
                <div className="absolute top-6 right-8 text-gray-200 select-none opacity-60" style={{ letterSpacing: '8px', lineHeight: '20px' }}>
                  <div className="text-xl">•••••</div>
                  <div className="text-xl">•••••</div>
                  <div className="text-xl">•••••</div>
                </div>
                <div className="absolute bottom-6 left-8 text-gray-200 select-none opacity-60" style={{ letterSpacing: '8px', lineHeight: '20px' }}>
                  <div className="text-xl">•••••</div>
                  <div className="text-xl">•••••</div>
                  <div className="text-xl">•••••</div>
                </div>
                <div className="relative z-10">
                  <h1 className="text-3xl md:text-5xl font-bold text-[#1D1D1D] mb-4">Shopping Cart</h1>
                  <nav className="flex justify-center items-center gap-2 text-sm md:text-base">
                    <a href="/" className="text-gray-600 hover:text-black transition-colors font-medium">Home</a>
                    <span className="text-gray-400 font-light">/</span>
                    <span className="text-gray-400">Shopping Cart</span>
                  </nav>
                </div>
              </header>

              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 bg-[#091422] p-4 rounded-t-lg font-semibold text-white mt-6">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Subtotal</div>
              </div>

              {/* Cart Items */}
              <div className="divide-y divide-gray-100 border-x border-b rounded-b-lg">
                {loading ? (
                  <div className="p-12 text-center text-gray-400">Loading cart...</div>
                ) : items.length > 0 ? (
                  items.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-4 p-4 items-center">
                      <div className="col-span-6 flex items-center gap-4">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X size={18} />
                        </button>

                        {/* ✅ Product image from item.product.image */}
                        <div className="w-16 h-16 bg-gray-50 rounded-lg flex-shrink-0 border border-gray-100 overflow-hidden">
                          <img
                            src={item.product?.image || '/placeholder.png'}
                            alt={item.product?.ProductName || 'Product'}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* ✅ Product name + ID */}
                        <div className="min-w-0">
                          <h3 className="font-semibold text-[#091422] truncate">
                            {item.product?.ProductName || `Product #${item.product_id}`}
                          </h3>
                          <p className="text-sm text-gray-400">
                            ID: <span className="text-gray-500">{item.product_id}</span>
                          </p>
                        </div>
                      </div>

                      {/* ✅ Unit price from item.product.price */}
                      <div className="col-span-2 text-center font-bold text-gray-700">
                        {item.product?.price != null
                          ? `$${item.product.price.toFixed(2)}`
                          : "—"}
                      </div>

                      {/* Quantity controls */}
                      <div className="col-span-2 flex justify-center">
                        <div className="flex items-center border border-gray-200 rounded-full px-2 py-1">
                          <button
                            onClick={() => updateQuantity(item, -1)}
                            className="p-1 text-gray-400 hover:text-black"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="mx-3 w-4 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item, 1)}
                            className="p-1 text-gray-400 hover:text-black"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      {/* ✅ Subtotal */}
                      <div className="col-span-2 text-right font-bold text-gray-700">
                        ${item.subtotal?.toFixed(2)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center text-gray-400">Your cart is empty.</div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex w-full md:w-auto gap-2">
                  <Input
                    type="text"
                    placeholder="Coupon Code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                  />
                  <Button>Apply Coupon</Button>
                </div>
                <Button onClick={clearCart}>Clear Shopping Cart</Button>
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: Order Summary */}
          <div className="lg:col-span-4 lg:sticky lg:top-8">
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-6">Order Summary</h2>
              <hr className="border-gray-100 mb-6" />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-medium">Items</span>
                  <span className="text-gray-800 font-bold">{itemsCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-medium">Sub Total</span>
                  <span className="text-gray-800 font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-medium">Shipping</span>
                  <span className="text-gray-800 font-bold">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-medium">Taxes</span>
                  <span className="text-gray-800 font-bold">${taxes.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-medium">Coupon Discount</span>
                  <span className="text-gray-400 font-bold">-${discount.toFixed(2)}</span>
                </div>
              </div>

              <hr className="border-gray-100 my-6" />

              <div className="flex justify-between items-center mb-8">
                <span className="text-gray-400 font-medium">Total</span>
                <span className="text-gray-800 text-xl font-bold">${total.toFixed(2)}</span>
              </div>

              <Button>
                <a href="/landing/checkout">Proceed to Checkout</a>
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default page;