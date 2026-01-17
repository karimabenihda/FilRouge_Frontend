"use client"
import ClientNav from "@/app/navigation/ClientNav";
import { Button } from "@/components/ui/button";
import React from "react";


export default function OrderTracking() {
 const steps = [
  "Confirmed",
  "Preparing",
  "Shipped",
  "Delivering",
  "Delivered",
];

  const currentStep = 3; // index du statut actuel

  return (
    <div className="max-w-5xl mx-auto">
     <div className="bg-[#F6F6F6] py-12 text-center relative border-b border-gray-100 mb-10">
        <h1 className="text-3xl font-bold text-[#091422] mb-2">Order Tracking</h1>
        <nav className="text-sm text-gray-500">
          <a href="/">Home</a> <span className="mx-2">/</span><a href="/landing/cart" >Shopping Cart</a> <span className="mx-2">/</span> <a href="/landing/checkout">Checkout</a><span className="mx-2">/</span> <span className="text-gray-400">Order Tracking</span>
        </nav>
      </div>
    <div className=" min-h-screen p-4 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Order Tracking</h1>
            <p className="text-sm text-gray-500">Order #CMD-45821</p>
          </div>
          <div className="text-sm text-gray-600">
            <p>Date : 12 Jan 2026</p>
            <p>Total : <span className="font-semibold">1 250 MAD</span></p>
          </div>
        </div>

{/* Desktop Timeline */}
<ol className="hidden md:flex items-center w-full text-sm font-medium text-center text-gray-500">
      {steps.map((step, index) => {
        const isDone = index < currentStep;
        const isActive = index === currentStep;
        const isLast = index === status.length - 1;

        return (
          <li
            key={index}
            className={`flex w-full items-center
              after:content-[''] after:w-full after:h-1 after:border-b after:mx-6 
              ${isLast ? "after:hidden" : ""}
              ${isDone || isActive ? "after:border-[#091422]" : "after:border-[#1e3753]"}
            `}
          >
            <span
              className={`flex items-center
                ${isDone ? "text-[#1e3753]" : ""}
                ${isActive ? "text-[#091422] font-semibold" : ""}
                ${!isDone && !isActive ? "text-gray-500" : ""}
              `}
            >
              {isDone ? "✔" : ""} {step}
            </span>
          </li>
        );
      })}
    </ol>

    
 

{/* Mobile Progress with Steps */}
<div className="md:hidden space-y-4 ">
  {/* Steps labels */}
  <div className="flex gap-3 overflow-x-auto pb-1">
    {steps.map((step, index) => {
      const isDone = index < currentStep;
      const isActive = index === currentStep;

      return (
        <div
          key={index}
          className={`px-3 py-1 rounded-full text-xs whitespace-nowrap border mb-3
            ${isDone ? "bg-gray-200 text-[#091422] border-[#091422]" : ""}
            ${isActive ? "bg-[#091422] text-white " : ""}
            ${!isDone && !isActive ? "bg-gray-100 text-gray-500 border-gray-300" : ""}
          `}
        >
          {step}
        </div>
      );
    })}
  </div>

  {/* Status text */}
  <p className="text-sm text-gray-600">
   Current statut :
    <span className="font-medium ml-1 text-[#091422]">{steps[currentStep]}</span>
  </p>

  {/* Progress bar */}
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div
      className="bg-[#091422] h-2 rounded-full transition-all duration-300"
      style={{
        width: `${((currentStep + 1) / steps.length) * 100}%`,
      }}
    />
  </div>

  {/* Step count */}
  <p className="text-xs text-gray-500 text-right">
    Étape {currentStep + 1} / {steps.length}
  </p>
</div>
        {/* Delivery info */}
   <div className="bg-[#c8ad93] rounded-xl p-4 space-y-2 text-white">
  <h2 className="font-semibold text-[#091422]">Delivery Information:</h2>
  <p><span className="font-semibold text-[#091422]">Carrier:</span> Amana</p>
  <p><span className="font-semibold text-[#091422]">Tracking Number:</span> AMN789456123</p>
  <p><span className="font-semibold text-[#091422]">Estimated Delivery:</span> 15 Jan 2026</p>
</div>


        {/* Products */}
     <div className="space-y-4">
  <h2 className="font-semibold text-[#091422]">Ordered Products</h2>

  <div className="flex items-center gap-4 border rounded-xl p-4">
    <img
      src="https://via.placeholder.com/80"
      alt="product"
      className="w-20 h-20 rounded-lg object-cover"
    />
    <div className="flex-1">
      <p className="font-medium">Modern Chair</p>
      <p className="text-sm text-gray-500">Quantity: 2</p>
    </div>
    <p className="font-semibold">500 MAD</p>
  </div>

  <div className="flex items-center gap-4 border rounded-xl p-4">
    <img
      src="https://via.placeholder.com/80"
      alt="product"
      className="w-20 h-20 rounded-lg object-cover"
    />
    <div className="flex-1">
      <p className="font-medium">Wooden Table</p>
      <p className="text-sm text-gray-500">Quantity: 1</p>
    </div>
    <p className="font-semibold">250 MAD</p>
  </div>
</div>

{/* Actions */}
<div className="flex flex-col md:flex-row gap-4 justify-end">
  <Button>
    Contact Support
  </Button>
  <Button className="bg-red-500 text-white hover:bg-red-600">
    Cancel Order
  </Button>
</div>


      </div>
    </div>
    </div>
  );
}
