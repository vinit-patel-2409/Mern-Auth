import React, { useState, useRef, useEffect, useContext } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config/api';


const Navbar = () => {
  const navigate = useNavigate()
  const { userData, backendUrl, setIsLoggedin, setUserData } = useContext(AppContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${backendUrl}/api/auth/logout`, {}, { withCredentials: true });
      setIsLoggedin(false);
      setUserData(null);
      navigate('/');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error logging out');
    }
  };

  const sendVerificationOtp = async () => {
    try {
      console.log('Sending verification OTP...');
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/auth/send-verify-otp`);
      console.log('OTP API Response:', data);

      if (data.success) {
        console.log('OTP sent successfully, navigating to /email-verify');
        setIsDropdownOpen(false);
        navigate('/email-verify');
        toast.success(data.message);
      } else {
        console.error('Failed to send OTP:', data.message);
        toast.error(data.message || 'Failed to send verification OTP');
      }
    } catch (error) {
      console.error('Error in sendVerificationOtp:', error);
      const errorMessage = error.response?.data?.message || 'Error sending OTP';
      console.error('Error details:', errorMessage);
      toast.error(errorMessage);
    }
  }


  // Debug log to check userData
  console.log('Navbar - userData:', userData);

  return (
    <div className='w-full flex justify-between items-center py-4 px-6 sm:px-24 absolute top-0 z-50 bg-white/10 backdrop-blur-md'>
      <img 
        src={assets.logo} 
        alt="" 
        className='w-28 sm:w-32 cursor-pointer' 
        onClick={() => navigate('/')} 
      />
      
      {userData ? (
        <div className='relative' ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className='flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-500 text-white rounded-full font-semibold hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 cursor-pointer focus:outline-none ring-2 ring-white/50 hover:ring-white'
            aria-haspopup="true"
            aria-expanded={isDropdownOpen}
          >
            {userData.name[0].toUpperCase()}
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white/90 backdrop-blur-xl rounded-lg shadow-2xl z-50 border border-gray-200/50 overflow-hidden">
              <div className='py-2'>
                <div className='px-4 py-3 border-b border-gray-200/80'>
                  <p className='text-sm font-semibold text-gray-800'>Signed in as</p>
                  <p className='text-sm text-gray-600 truncate'>{userData.email}</p>
                </div>
                
                <div className="py-1">
                  {userData.isAccountVerified === false && (
                    <button 
                      onClick={() => {
                        sendVerificationOtp();
                        setIsDropdownOpen(false);
                      }}
                      className='flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 whitespace-nowrap transition-colors duration-200'
                    >
                      Verify Email
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsDropdownOpen(false);
                    }}
                    className='flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors duration-200'
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button 
          onClick={() => navigate("/login")} 
          className='flex items-center gap-2 bg-gradient-to-br from-indigo-500 to-blue-500 text-white rounded-full px-6 py-2 font-semibold hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg'
        >
          Login <img src={assets.arrow_icon} alt="" className='w-4 h-4'/>
        </button>
      )}
    </div>
  )
}

export default Navbar;