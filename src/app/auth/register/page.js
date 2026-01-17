"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section className="relative flex flex-col md:flex-row justify-center px-4 py-5 lg:py-10 gap-14 md:gap-20 mx-auto">
      {/* Background glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-[350px] h-[350px] bg-[#c8ad93]/20 rounded-full blur-[200px]" />

      {/* Left Text */}
      <div className="text-center lg:pt-15 md:text-left mt-1 px-2">
        {/* Community block */}
        <div className="flex items-center p-1.5 rounded-full border border-[#c8ad93] text-xs w-fit mx-auto md:mx-0 mb-4">
          <div className="flex -space-x-2">
            <img
              className="w-7 h-7 rounded-full border border-[#c8ad93]"
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=50"
              alt="user1"
            />
            <img
              className="w-7 h-7 rounded-full border border-[#c8ad93]"
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=50"
              alt="user2"
            />
            <img
              className="w-7 h-7 rounded-full border border-[#c8ad93]"
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=50&h=50&auto=format&fit=crop"
              alt="user3"
            />
          </div>
          <p className="ml-2 text-xs">Join 1M+ happy customers</p>
        </div>

        <h1 className="font-semibold text-2xl md:text-6xl bg-gradient-to-r from-[#091422] to-[#5c6f91] bg-clip-text text-transparent max-w-lg mt-4 mx-auto md:mx-0">
          Personalize Your Home with Style
        </h1>

        <p className="text-sm md:text-lg max-w-md mt-4 mx-auto md:mx-0">
          Let our design team guide you in choosing the perfect furniture for your
          home. Fill out the form and start your journey today.
        </p>
      </div>

      {/* Form */}
      <div className="w-full max-w-lg mx-auto bg-gray-50 border border-[#c8ad93]/30 rounded-xl p-6 md:p-8 shadow-lg">
        <h2 className="font-bold text-3xl text-[#1e3753] text-center md:text-left">
          Register
        </h2>

        <p className="text-sm mt-2 text-[#1e3753] text-center md:text-left">
           Let’s create your account
        </p>

        <form className="flex flex-col gap-4 pt-7">
          <div>
            <Label className="block text-sm">First Name</Label>
            <Input type="text" required placeholder="Karima" />
          </div>

          <div>
            <Label className="block text-sm">Last Name</Label>
            <Input type="text" required placeholder="Ben Ihda" />
          </div>

          <div>
            <Label className="block text-sm">Email</Label>
            <Input type="email" required placeholder="you@example.com" />
          </div>

          <div className="relative">
            <Label className="block text-sm">Password</Label>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute bottom-1 right-3 -translate-y-1/2 z-20 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <Button type="submit">Register</Button>
        </form>

        {/* Divider */}
        <div className="mt-6 grid grid-cols-3 items-center">
          <hr className="border-gray-300" />
          <p className="text-center text-sm text-[#1e3753]">OR</p>
          <hr className="border-gray-300" />
        </div>

        {/* Google Login */}
        <Button className="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 hover:bg-[#f0f0f0] font-medium text-gray-600">
          <svg
            className="mr-3"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="25px"
          >
            <path
              fill="#FFC107"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            />
            <path
              fill="#FF3D00"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            />
            <path
              fill="#4CAF50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            />
            <path
              fill="#1976D2"
              d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            />
          </svg>
          Login with Google
        </Button>

        <div className="mt-4 text-sm flex flex-col md:flex-row gap-2 md:gap-0 justify-between items-center text-center md:text-left">
          <p className="text-[#1e3753]">
            Already have an account?{"   "}
            <a href="/auth/login" className="text-[#c8ad93] underline">
              Login here
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
