import React from 'react'
import ClientNav from '../navigation/ClientNav'
import { Button } from '@/components/ui/button'
import RotatingText from '../react-bits/RotatingText'

function Hero() {
  return (
    <div>
        <div>
            <section style={{ backgroundImage: "url('/images/hero_11zon.webp')" }}
 className="flex flex-col items-center pb-48 text-center text-sm text-white max-md:px-2 bg-cover bg-center">
            <ClientNav/>
                <div className="flex flex-wrap items-center justify-center p-1.5 mt-24 md:mt-28 rounded-full border border-slate-400 text-xs">
                    <div className="flex items-center">
                        <img className="size-7 rounded-full border-3 border-white"
                            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=50" alt="userImage1" />
                        <img className="size-7 rounded-full border-3 border-white -translate-x-2"
                            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=50" alt="userImage2" />
                        <img className="size-7 rounded-full border-3 border-white -translate-x-4"
                            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=50&h=50&auto=format&fit=crop"
                            alt="userImage3" />
                    </div>
                    <p className=" -translate-x-2">Join a community of 100k+ happy homeowners</p>
                </div>

              <h1 className="text-[45px]/[52px] md:text-6xl/[65px] mt-6 max-w-4xl text-white">
  Transform your{" "}
  {/* text-[#1e3753] bg-[#c8ad93]  */}
  <span className="inline-block">
    <RotatingText
      texts={["house", "living room", "kitchen", "bedroom", "office"]}
      mainClassName="px-2 md:px-3 p-1 rounded-lg text-[#fff] bg-[#c8ad93] font-semibold overflow-hidden inline-block"
      staggerFrom="last"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "-120%" }}
      staggerDuration={0.025}
      splitLevelClassName="overflow-hidden"
      transition={{ type: "spring", damping: 30, stiffness: 400 }}
      rotationInterval={2000}
    />
  </span>{" "}
  into a cozy sanctuary
</h1>


                <p className="text-base mt-2 max-w-xl">
                    Explore premium furniture designed for comfort, style, and modern living. Make every room feel like home.
                </p>

                <p className="text-base mt-3 md:mt-7 max-w-xl">
                    Shop now and enjoy exclusive offers on our best-selling collections.
                </p>

                <form className="flex items-center mt-8 max-w-lg h-16 w-full rounded-full border border-slate-50">
                    <input type="email" placeholder="Enter your email for special offers" className="w-full h-full outline-none bg-transparent pl-6 pr-2 text-white placeholder:text-slate-300 rounded-full" />
                    <Button className="text-nowrap md:px-10 h-12 mr-2 rounded-full font-medium transition">
                        Get Early Access
                    </Button>
                </form>
            </section>
          </div>  
    </div>
  )
}

export default Hero
