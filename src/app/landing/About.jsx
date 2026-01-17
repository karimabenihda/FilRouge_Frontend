import React from 'react'

function About() {
  return (

    <>
    <section className="max-w-6xl mx-auto  ">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">

        <div className="bg-[#1e3753] rounded-2xl p-8 text-white flex flex-col justify-center">
      <div className="flex justify-between">
        <h1>Designed for modern living</h1> 
       
  <div className="relative w-18 h-18 rounded-full overflow-hidden">
     <img
      src="/images/bg.png"
      alt=""
      className="absolute inset-0 w-full h-full object-cover"
    />

    {/* Overlay */}
    {/* <div className="absolute inset-0 bg-[#715037] opacity-60"></div> */}
    <div className="absolute inset-0 opacity-60"></div>
 </div>
 </div>

          <h3 className="text-4xl font-bold">150+</h3>
          <p className="mt-2 text-sm opacity-90">
            Years of combined experience delivering quality home solutions
          </p>
        </div>

        {/* Right content */}
        <div className="md:col-span-2 bg-[#f7f4f1] rounded-2xl p-8 flex flex-col md:flex-row gap-6 items-center">

        <div className="flex-1">
             <h2 className="text-2xl font-semibold text-gray-900">
              Who We Are
            </h2>
            <p className="mt-3 text-gray-600 text-sm leading-relaxed">
              We are a team passionate about creating thoughtful home solutions.
              Our mission is to combine design, functionality, and innovation
              to improve everyday living.
            </p>
        </div>

          {/* Image */}
          <div className="flex-1">
            <img
              src="/images/picinrigt.jfif"
              alt="Who we are"
              className="rounded-xl object-cover w-full h-48"
            />
          </div>

        </div>
      </div>
    </section>

    
    </>
  )
}

export default About
