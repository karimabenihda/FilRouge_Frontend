"use client"
import React, { useState } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ClientNav from '@/app/navigation/ClientNav';

const initialItems = [
  { id: 1, name: 'Wooden Sofa Chair', color: 'Grey', price: 80, quantity: 4, image: '/api/placeholder/80/80' },
  { id: 2, name: 'Red Gaming Chair', color: 'Black', price: 90, quantity: 2, image: '/api/placeholder/80/80' },
  { id: 3, name: 'Swivel Chair', color: 'Light Brown', price: 60, quantity: 1, image: '/api/placeholder/80/80' },
  { id: 4, name: 'Circular Sofa Chair', color: 'Brown', price: 90, quantity: 2, image: '/api/placeholder/80/80' },
];

const page = () => {
  const [items, setItems] = useState(initialItems);
  const itemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = items.length > 0 ? 0.00 : 0.00; // Example logic
  const taxes = subtotal * 0.00; // Example logic
  const discount = items.length > 0 ? 100.00 : 0.00;
  const total = subtotal + shipping + taxes - discount;

  const updateQuantity = (id, delta) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };
  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div>
<ClientNav/>
    
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      {/* Main Responsive Grid Container */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Shopping Cart (Takes 8/12 of width) */}
        <div className="lg:col-span-8 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
<header className="w-full  py-4 md:py-6 text-center relative overflow-hidden border-b border-gray-100">
      {/* Top Right Decorative Dots */}
      <div 
        className="absolute top-6 right-8 text-gray-200 select-none opacity-60" 
        style={{ letterSpacing: '8px', lineHeight: '20px' }}
      >
        <div className="text-xl">•••••</div>
        <div className="text-xl">•••••</div>
        <div className="text-xl">•••••</div>
      </div>

      {/* Bottom Left Decorative Dots */}
      <div 
        className="absolute bottom-6 left-8 text-gray-200 select-none opacity-60" 
        style={{ letterSpacing: '8px', lineHeight: '20px' }}
      >
        <div className="text-xl">•••••</div>
        <div className="text-xl">•••••</div>
        <div className="text-xl">•••••</div>
      </div>

      <div className="relative z-10">
        <h1 className="text-3xl md:text-5xl font-bold text-[#1D1D1D] mb-4">
          Shopping Cart
        </h1>
        
        <nav className="flex justify-center items-center gap-2 text-sm md:text-base">
          <a href="/" className="text-gray-600 hover:text-black transition-colors font-medium">
            Home
          </a>
          <span className="text-gray-400 font-light">/</span>
          <span className="text-gray-400">Shopping Cart</span>
        </nav>
      </div>
    </header>            
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 bg-[#091422] p-4 rounded-t-lg font-semibold text-white">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Subtotal</div>
            </div>

            {/* Cart Items */}
            <div className="divide-y divide-gray-100 border-x border-b rounded-b-lg">
              {items.length > 0 ? (
                items.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 p-4 items-center">
                    <div className="col-span-6 flex items-center gap-4">
                      <button onClick={() => removeItem(item.id)}  
                      className="text-gray-400 hover:text-red-500 transition-colors">
                        <X size={18} />
                      </button>
                      <div className="w-16 h-16 bg-gray-50 rounded-lg flex-shrink-0 border border-gray-100 overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-[#091422] truncate">{item.name}</h3>
                        <p className="text-sm text-gray-400">Color : <span className="text-gray-500">{item.color}</span></p>
                      </div>
                    </div>

                    <div className="col-span-2 text-center font-bold text-gray-700">
                      ${item.price.toFixed(2)}
                    </div>

                    <div className="col-span-2 flex justify-center">
                      <div className="flex items-center border border-gray-200 rounded-full px-2 py-1">
                        <button onClick={() => updateQuantity(item.id, -1)} 
                       className="p-1 text-gray-400 hover:text-black">
                          <Minus size={14} />
                        </button>
                        <span className="mx-3 w-4 text-center text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)}>
                         {/* className="p-1 text-gray-400 hover:text-black"> */}
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="col-span-2 text-right font-bold text-gray-700">
                      ${(item.price * item.quantity).toFixed(2)}
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
                //   className="border border-gray-200 rounded-full px-6 py-3 flex-grow md:w-64 focus:outline-none focus:ring-2 focus:ring-green-800/20"
                />
                <Button
                //  className="bg-green-900 text-white px-8 py-3 rounded-full font-medium hover:bg-green-950 transition-colors whitespace-nowrap"
                 >
                  Apply Coupon
                </Button>
              </div>
              <Button 
                onClick={() => setItems([])}
                // className="text-green-800 font-semibold underline decoration-2 underline-offset-4 hover:text-green-950"
              >
                Clear Shopping Cart
              </Button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Order Summary (Takes 4/12 of width) */}
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

            <Button 
             ><a href="/landing/checkout" >
              Proceed to Checkout
            </a></Button>
          </div>
        </div>

      </div>
    </div>
    </div>
  );
};

export default page;