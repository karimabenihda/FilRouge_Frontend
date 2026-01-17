"use client"
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import React, { useState } from 'react'

function ClientNav() {
    const [open, setOpen] = useState(false)
    return (
    <nav className="flex justify-between items-center max-w-6xl mx-auto py-3.5 border-b border-slate-200/20 w-full">
               <img src="/images/logo/elan.png" className='h-10 -mt-3'/>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8">
                <a href="/">Home</a>
                <a href="/landing/collection">Collections</a>
                <a href="/landing/Contact">Contact</a>

             <div className="relative w-full  md:w-50 text-gray-600">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                         <input
                           type="text"
                           placeholder="Search furniture"
                           className="pl-10 pr-4 py-2 border bg-white rounded-full focus:outline-none focus:bg-white focus:border-gray-200 w-full transition-all"
                         />
                       </div>

                <a href="/landing/cart" className="relative cursor-pointer">
                    <svg width="18" height="18" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0" stroke="#060e19" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-[#c8ad93] w-[18px] h-[18px] rounded-full">3</button>
                </a>

                <Button className="">
                        
                    <a href="/auth/log in">
                    Login
                    </a>
                </Button>
            </div>

            <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu" className=" px-4 md:px-1 sm:hidden hover:cursor-pointer">
                 <svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="21" height="1.5" rx=".75" fill="#426287" />
                    <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#426287" />
                    <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="#426287" />
                </svg>
            </button>

            {/* Mobile Menu */}
            <div className={`${open ? 'flex' : 'hidden'} space-y-2  text-[#1e3753] absolute top-[60px] left-0 w-full bg-white z-14 shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}>
                  <div className="relative w-full  md:w-50 text-gray-600">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                         <input
                           type="text"
                           placeholder="Search furniture"
                           className="pl-10 pr-4 py-2 border bg-white rounded-full focus:outline-none focus:bg-white focus:border-gray-200 w-full transition-all"
                         />
                       </div>
                <a href="/" className="block ">Home</a>
                <a href="/landing/collection" className="block">Collections</a>
                <a href="/landing/Contact" className="block">Contact</a>
                  <a href="/landing/cart" className="relative cursor-pointer">
                    <svg width="18" height="18" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0" stroke="#060e19" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-[#c8ad93] w-[18px] h-[18px] rounded-full">3</button>
                </a>
                <Button className="-ml-1">
                    Login
                </Button>
                
            </div>

        </nav>
    )
}
export default ClientNav