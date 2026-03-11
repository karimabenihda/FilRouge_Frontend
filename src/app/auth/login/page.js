"use client"
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // ✅ important

const Page = () => {
  const router = useRouter(); // ✅ must be inside component

  const [showPassword, setShowPassword] = useState(false);
  const [formdata, setFormdata] = useState({
    email: "",
    password: ""
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/auth/login',
        formdata
      );

      const token = response.data.access_token;
      localStorage.setItem("token", token);

      const payload = JSON.parse(atob(token.split(".")[1]));
      localStorage.setItem("user_id", payload.user_id);
      localStorage.setItem("user_email", payload.sub);
      localStorage.setItem("user_role", payload.role);

      
      if (response.status === 200) {
        if (payload.role === "admin") {
          router.push('/dashboard');
        } if (payload.role === "client"){
          router.push('/landing/collection'); // redirect regular clients to landing page
        }
        else{
          console.log('nothing')
        }
      }

    } catch (error) {
      console.log('Login error:', error);
    }
  };

  const handleChange = (e) => {
    setFormdata({
      ...formdata,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section className="min-h-screen flex box-border justify-center items-center p-4">
      <div className="bg-gray-50 rounded-2xl flex p-5 items-center shadow-lg">
        {/* Login Form Section */}
        <div className="md:w-1/2 px-8 py-4">
          <h2 className="font-bold text-3xl text-[#1e3753]">Login</h2>
          <p className="text-sm mt-4 text-[#1e3753]">
            If you are already a member, easily log in now.
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4 pt-7">
            <Input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              value={formdata.email}
              required
            />

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleChange}
                value={formdata.password}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer z-20 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button type="submit">Login</Button>
          </form>

          <div className="mt-2 text-xs border-b border-gray-300 py-4 text-[#1e3753] cursor-pointer">
            Forgot password?
          </div>
          <div className="mt-4 text-sm flex justify-between items-center">
            <p className="text-[#1e3753]">Don't have an account?</p>
            <a className="text-[#c8ad93] underline" href='/auth/register'>Register</a>
          </div>
        </div>

        {/* Image Section */}
        <div className="md:block hidden w-1/2">
          <img
            className="rounded-2xl object-cover h-[500px] w-full"
            src="https://i.pinimg.com/736x/fd/d6/7f/fdd67f502e09fe7f8575d5d475f7a8b8.jpg"
            alt="login decoration"
          />
        </div>
      </div>
    </section>
  );
};

export default Page;