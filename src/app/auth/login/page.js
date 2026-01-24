"use client"
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react'; // Using lucide-react for cleaner icons
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';


const page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formdata,setFormdata]=useState(
   { email  :"",
    password:""}
)

  const handleLogin=async(e)=>{
    e.preventDefault();
    try{
      const response =await axios.post('http://127.0.0.1:8000/api/auth/login',formdata)
      const token=response.data.access_token
      localStorage.setItem("token",token)
      console.log(response)
    }catch(error){
      console.log(error)
    }
  }
  const handleChange=(e)=>{
    setFormdata({
      ...formdata,
      [e.target.name]:e.target.value
    })

  }
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section className=" min-h-screen flex box-border justify-center items-center p-4">
      <div className="bg-gray-50 rounded-2xl flex  p-5 items-center shadow-lg">
        {/* Login Form Section */}
        <div className="md:w-1/2 px-8 py-4">
          <h2 className="font-bold text-3xl text-[#1e3753]">Login</h2>
          <p className="text-sm mt-4 text-[#1e3753]">If you are already a member, easily log in now.</p>

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

            <Button 
              // className="bg-[#1e3753] text-white py-2 rounded-xl hover:scale-105 duration-300 hover:bg-[#206ab1] font-medium mt-2" 
              type="submit"
            >
              Login
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-6 grid grid-cols-3 items-center text-gray-100">
            <hr className="border-gray-300" />
            <p className="text-center text-sm text-[#1e3753]">OR</p>
            <hr className="border-gray-300" />
          </div>

          {/* Google Login */}
          <Button className="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 hover:bg-[#f0f0f0] font-medium text-gray-600">
            <svg className="mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="25px">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
            </svg>
            Login with Google
          </Button>

          <div className="mt-2 text-xs border-b border-gray-300 py-4 text-[#1e3753] cursor-pointer">
            Forgot password?
          </div>
          <div className="mt-4 text-sm flex justify-between items-center">
            <p className="text-[#1e3753]">Don't have an account?</p>
            <a className="text-[#c8ad93] underline" href='/auth/register'
              > Register
            </a>
            {/* <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account? <a href="" className="font-medium text-blue-600 hover:underline dark:text-blue-500">Login here</a>
              </p> */}
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

export default page;