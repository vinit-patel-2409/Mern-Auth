import React from 'react'
import { assets } from '../assets/assets'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const Header = () => {

  const { userData } = useContext(AppContext);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-4 text-center text-gray-800 -mt-16'>
        <img src={assets.header_img} alt="" className='w-40 h-40 rounded-full mb-6 shadow-2xl shadow-indigo-200'/>
        <h1 className='text-4xl sm:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500'>
          Hey {userData ? userData.name : "Developer"} <img src={assets.hand_wave} alt="" className='w-10 sm:w-14 aspect-square inline-block -rotate-12'/>
        </h1>
        <h2 className='text-gray-600 text-md sm:text-lg mb-4 max-w-2xl'>
          Welcome to our authentication system. This is a showcase of a modern, secure, and developer-friendly MERN stack application.
        </h2>
        <p className='max-w-3xl text-gray-500 mb-8'>
          Experience seamless authentication, robust user management, and a clean API. This project demonstrates best practices in building full-stack applications with React, Node.js, and MongoDB.
        </p>
        <button className='flex items-center gap-3 bg-gradient-to-br from-indigo-500 to-blue-500 text-white rounded-full px-8 py-3 font-semibold hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl'>
          Get Started <img src={assets.arrow_icon} alt="" className='w-4 aspect-square'/>
        </button>
    </div>
  )
}

export default Header