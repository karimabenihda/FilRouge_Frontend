"use client"
import React from "react";
import RelatedBlogs from "./RelatedBlogs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Page() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-20">

      {/* TOP: CONTACT */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch">

        {/* LEFT: FORM */}
        <form className="flex flex-col text-sm text-slate-800">

          <p className="text-xs bg-[#ddd] text-[#1e3753] font-medium px-3 py-1 rounded-full w-fit">
            Contact Us
          </p>

          <h1 className="text-4xl font-bold py-4">
           Let’s bring your vision to life.
          </h1>

          <p className="text-gray-500 pb-6">
            Contact us for personalized support.{" "}
            {/* <a href="#" className="text-indigo-600 hover:underline">
              hello@prebuiltui.com
            </a> */}
          </p>

          {/* Full Name */}
          <Label className="font-medium">Full Name</Label>
            <Input
              type="text"
               placeholder="Enter your full name"
              required
            />
 
          {/* Email */}
          <Label className="font-medium mt-4">Email Address</Label>
             <Input
              type="email"
              placeholder="Enter your email address"
              required
            />
 
          {/* Message */}
          <Label className="font-medium mt-4">Message</Label>
          <Textarea
            rows="4"
            placeholder="Enter your message"
            required
          />

          {/* Submit */}
          <Button
            type="submit"
            className="mt-6"
            //  bg-indigo-500 hover:bg-indigo-600 text-white py-2.5 rounded-full transition"
          >
            Submit Form
          </Button>

        </form>

        {/* RIGHT: CONTACT INFO */}
<div className="bg-[#f7f4f1] rounded-2xl p-8 h-full flex flex-col">

  <h3 className="text-4xl font-semibold text-[#1c1d29] mb-4">
    Why Contact Us?
  </h3>

  <p className="text-gray-600 mb-6 leading-relaxed">
    Choosing the right furniture is about more than style — it’s about comfort,
    functionality, and creating a space that truly feels like home.
    Our dedicated team is here to guide you through every step, from inspiration
    to final installation.
  </p>

  <ul className="space-y-4 text-sm text-slate-700">
    <li>🪑 Personalized furniture recommendations tailored to your space</li>
    <li>🎨 Expert interior styling and layout advice</li>
    <li>📦 Fast, reliable delivery with careful handling</li>
    <li>🤝 Ongoing support before and after your purchase</li>
  </ul>

  <div className="mt-8 border-t pt-6 text-sm">
    <p className="font-medium text-slate-800 mb-1">
      Visit our showroom
    </p>
    <p className="text-gray-500 leading-relaxed">
      Casablanca, Morocco <br />
      Mon – Sat · 9:00 – 18:00 <br />
      Experience our collections in person and get expert advice on-site.
    </p>
  </div>

</div>


      </div>

      {/* BLOGS */}
      <RelatedBlogs />

    </section>
  );
}
