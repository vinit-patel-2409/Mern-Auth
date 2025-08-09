import React from 'react'
import { assets } from '../assets/assets'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
const Header = () => {

  const { userData } = useContext(AppContext);

  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>
        <img src={assets.header_img} alt="" className='w-36 h-36 rounded-full mb-6'/>
        <h1 className='text-2xl font-bold sm:text-3xl font-medium mb-2'>Hey {userData?userData.name:"Developer"} <img src={assets.hand_wave} alt="" className='w-6 aspect-square inline-block'/></h1>
        <h2 className='text-gray-500 text-sm sm:text-base mb-2'>Welcome to our authentication system. Please login to continue.</h2>
        <p className='mb-2'>
    Let's start with a quick product tour and we'll have you up and running in no time.
    Our platform offers seamless authentication, secure user management, and a developer-friendly API.
    Get started today to experience lightning-fast authentication flows and robust security features
    that scale with your application's needs.
</p>
        <button className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 hover:bg-gray-100 transition-all duration-300 font-medium'>Get Started<img src={assets.arrow_icon} alt="" className='w-4 aspect-square'/></button>
    </div>
  )
}

export default Header