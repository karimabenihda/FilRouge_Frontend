"use client"
import React, { useState } from 'react';
import { ChevronRight, CreditCard, User, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ClientNav from '@/app/navigation/ClientNav';

const page = () => {
  const [step, setStep] = useState(1);

  const getStepClass = (s) => s <= step ? "bg-[#1e3753] text-white" : "bg-gray-200 text-gray-500";
  const getLineClass = (s) => s < step ? "border-[#1e3753]" : "border-gray-200";

  return (
    <div>

    <ClientNav/>
    <div className="bg-[#F9F9F9] min-h-screen font-sans pb-20">
      {/* 1. Page Header (Reusable Component) */}
      <div className="bg-[#F6F6F6] py-12 text-center relative border-b border-gray-100 mb-10">
        <h1 className="text-3xl font-bold text-[#091422] mb-2">Checkout</h1>
        <nav className="text-sm text-gray-500">
          <a href="/">Home</a> <span className="mx-2">/</span>          <a href="/landing/cart" >Shopping Cart</a> <span className="mx-2">/</span> <a href=""  className="text-gray-400">Checkout</a>
        </nav>
      </div>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: Checkout Steps Form */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Progress Bar (Your provided logic integrated) */}
          <ol className="flex items-center w-full space-x-4 mb-10 px-4">
            <li className={`flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b ${getLineClass(1)} after:border-4 after:inline-block after:ms-4 after:rounded-full`}>
                <span className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 transition-colors ${getStepClass(1)}`}>
                    <User size={20} />
                </span>
            </li>
            <li className={`flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b ${getLineClass(2)} after:border-4 after:inline-block after:ms-4 after:rounded-full`}>
                <span className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 transition-colors ${getStepClass(2)}`}>
                    <CreditCard size={20} />
                </span>
            </li>
            <li className="flex items-center">
                <span className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 transition-colors ${getStepClass(3)}`}>
                    <CheckCircle size={20} />
                </span>
            </li>
          </ol>

          {/* Form Content */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <h2 className="text-2xl font-bold text-gray-800">User Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input type="text" placeholder="First Name"  />
                  <Input type="text" placeholder="Last Name"   />
                  <Input type="email" placeholder="Email Address" className="md:col-span-2 focus:bg-white " />
                  <Input type="text" placeholder="Shipping Address" className="md:col-span-2 focus:bg-white  " />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <h2 className="text-2xl font-bold text-gray-800">Payment Information</h2>
                <div className="space-y-4">
                  <Input type="text" placeholder="Cardholder Name" className="w-full" />
                  <div className="relative">
                    <Input type="text" placeholder="Card Number" className="w-full" />
                    <CreditCard className="absolute right-4 top-2.5 text-gray-400" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input type="text" placeholder="MM/YY" className="" />
                    <Input type="text" placeholder="CVV" className="" />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="text-center py-10 space-y-4 animate-in zoom-in duration-500">
                <div className="flex justify-center text-green-600"><CheckCircle size={80} /></div>
                <h2 className="text-3xl font-bold text-gray-800">Order Confirmed!</h2>
                <p className="text-gray-500">Your order #12345 is ready for shipping.</p>
                <div className="bg-gray-50 p-6 rounded-xl inline-block text-left w-full max-w-md">
                  <p className="font-bold mb-2">Confirmation Details</p>
                  <p className="text-sm text-gray-600">A confirmation email has been sent to your inbox. Thank you for shopping with us!</p>
                </div>
                <Button>
                  <a href="/landing/orderTracking">
                    Order Tracking
                  </a>
                </Button>
                
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-10 flex justify-between">
              {step > 1 && step < 3 && (
                <Button 
                  onClick={() => setStep(step - 1)}
                 >
                  Back
                </Button>
              )}
              {step < 3 && (
                <Button 
                  onClick={() => setStep(step + 1)}
                  className="ml-auto "
                  >
                  {step === 2 ? 'Place Order' : 'Next Step'} <ChevronRight size={18} />
                </Button>
               )}
            </div>
          </div>
        </div>

        {/* RIGHT: Order Summary (Simplified for Checkout) */}
        <div className="lg:col-span-4 lg:sticky lg:top-8">
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-400"><span>Subtotal</span> <span className="text-gray-800 font-bold">$740.00</span></div>
                    <div className="flex justify-between text-gray-400"><span>Coupon</span> <span className="text-gray-400 font-bold">-$100.00</span></div>
                    <hr className="border-gray-50" />
                    <div className="flex justify-between text-gray-800 text-2xl font-bold"><span>Total</span> <span>$640.00</span></div>
                </div>
            </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default page;