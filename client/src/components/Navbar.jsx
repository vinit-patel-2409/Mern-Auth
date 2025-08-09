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
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0 z-50'>
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
            className='flex items-center justify-center w-10 h-10 border border-gray-500 rounded-full text-gray-800 hover:bg-gray-100 transition-all duration-300 cursor-pointer focus:outline-none'
            aria-haspopup="true"
            aria-expanded={isDropdownOpen}
          >
            {userData.name[0].toUpperCase()}
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50">
              <div className='py-1'>
                <div className='px-4 py-2 text-sm text-gray-700 border-b border-gray-100'>
                  {userData.email}
                </div>
                
                <div className="border-t border-gray-100">
                  {console.log('isAccountVerified:', userData.isAccountVerified, 'Type:', typeof userData.isAccountVerified)}
                  {userData.isAccountVerified === false && (
                    <button 
                      onClick={() => {
                        sendVerificationOtp();
                        setIsDropdownOpen(false);
                      }}
                      className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 whitespace-nowrap'
                    >
                      Verify Email
                    </button>
                  )}
                </div>
                
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsDropdownOpen(false);
                  }}
                  className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button 
          onClick={() => navigate("/login")} 
          className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all duration-300'
        >
          Login <img src={assets.arrow_icon} alt="" className='w-4 h-4'/>
        </button>
      )}
    </div>
  )
}

export default Navbar;