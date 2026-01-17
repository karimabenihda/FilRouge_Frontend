import { Button } from '@/components/ui/button';
import React from 'react'

export default function Cta() {
    return (
        <>
            <div
                className="max-w-6xl py-16 md:pl-24 md:w-full mx-2 md:mx-auto flex flex-col items-start justify-center text-left bg-gradient-to-b from-[#1e3753] to-[#0b1826] rounded-2xl p-10 text-white">
                <div className="flex items-center">
                    <div className="flex -space-x-3 pr-3">
                        <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200" alt="customer"
                            className="size-8 rounded-full hover:-translate-y-px transition z-1 border-2 border-[#1e3753]" />
                        <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200" alt="customer"
                            className="size-8 rounded-full hover:-translate-y-px transition z-[2] border-2 border-[#1e3753]" />
                        <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop"
                            alt="customer"
                            className="size-8 rounded-full hover:-translate-y-px transition z-[3] border-2 border-[#1e3753]" />
                    </div>
                    <div>
                        <div className="flex items-center gap-px">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.85536 0.463527C6.00504 0.00287118 6.65674 0.00287028 6.80642 0.463526L7.82681 3.60397C7.89375 3.80998 8.08572 3.94946 8.30234 3.94946H11.6044C12.0888 3.94946 12.2901 4.56926 11.8983 4.85397L9.22687 6.79486C9.05162 6.92219 8.97829 7.14787 9.04523 7.35388L10.0656 10.4943C10.2153 10.955 9.68806 11.338 9.2962 11.0533L6.62478 9.11244C6.44954 8.98512 6.21224 8.98512 6.037 9.11244L3.36558 11.0533C2.97372 11.338 2.44648 10.955 2.59616 10.4943L3.61655 7.35388C3.68349 7.14787 3.61016 6.92219 3.43491 6.79486L0.763497 4.85397C0.37164 4.56927 0.573027 3.94946 1.05739 3.94946H4.35944C4.57606 3.94946 4.76803 3.80998 4.83497 3.60397L5.85536 0.463527Z" fill="#FF8F20"/>
                                </svg>
                            ))}
                        </div>
                        <p className="text-sm text-gray-300">Trusted by 2k+ homeowners</p>
                    </div>
                </div>
                <h1 className="text-4xl md:text-[46px] md:leading-[60px] font-semibold mt-5 bg-gradient-to-r from-white to-[#5c6f91] text-transparent bg-clip-text">
                    Transform your living space.
                </h1>
                <p className="bg-gradient-to-r from-white to-[#5c6f91] text-transparent bg-clip-text text-lg">
                    Discover premium furniture designed for comfort and elegance.
                </p>
                <Button className="mt-4" >
                     Explore Collection
                </Button>
             </div>
        </>
    );
};