"use client"
import React, { useState } from 'react'

export function Faqs () {
    const [openIndex, setOpenIndex] = useState(null);

const faqs = [
  {
    question: "Do you offer custom furniture?",
    answer:
      "Yes, we offer custom furniture options to fit your space, style, and preferences. Contact us to discuss materials, dimensions, and finishes.",
  },
  {
    question: "What materials are used in your furniture?",
    answer:
      "Our furniture is crafted using high-quality materials such as solid wood, premium fabrics, metal, and eco-friendly finishes to ensure durability and comfort.",
  },
  {
    question: "Do you provide delivery and installation?",
    answer:
      "Yes, we provide fast and secure delivery. Our team can also assist with installation to ensure everything is perfectly placed in your home.",
  },
  {
    question: "How do I maintain and care for my furniture?",
    answer:
      "Each product comes with care instructions. Generally, regular dusting, avoiding direct sunlight, and using appropriate cleaning products will help maintain its beauty.",
  },
];

    return (
        <>
            
            <div className="max-w-4xl mx-auto flex flex-col items-center justify-center  ">
             <p className="text-sm font-medium text-[#c8ad93]">FAQ’s</p>

<h1 className="text-3xl font-semibold text-center text-[#1e3753]">
  Have Questions About Our Furniture?
</h1>

<p className="text-sm text-slate-500 mt-2 pb-8 text-center">
  Find answers about materials, customization, delivery, and care.  
  We’re here to help you create a space that feels like home.
</p>
                {faqs.map((faq, index) => (
                    <div className="border-b border-slate-200 py-4 cursor-pointer w-full" key={index} onClick={() => setOpenIndex(openIndex === index ? null : index)}>
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-medium">
                                {faq.question}
                            </h3>
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${openIndex === index ? "rotate-180" : ""} transition-all duration-500 ease-in-out`}>
                                <path d="m4.5 7.2 3.793 3.793a1 1 0 0 0 1.414 0L13.5 7.2" stroke="#1D293D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <p className={`text-sm text-slate-500 transition-all duration-500 ease-in-out max-w-md ${openIndex === index ? "opacity-100 max-h-[300px] translate-y-0 pt-4" : "opacity-0 max-h-0 -translate-y-2"}`} >
                            {faq.answer}
                        </p>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Faqs
