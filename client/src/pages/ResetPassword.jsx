import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const ResetPassword = () => {
  const {backendUrl} = useContext(AppContext)
  axios.defaults.withCredentials = true;
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [otp, setOtp] = useState("")
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false)
    const inputRef = React.useRef([]);
    const handleinput = (e, index) => {
      // Only allow one digit
      const value = e.target.value;
      if (value.length > 1) {
        e.target.value = value[value.length - 1]; // Take only the last character
      }
  
      // Only allow numeric input
      if (value && !/^\d*$/.test(value)) {
        e.target.value = value.replace(/\D/g, "");
        return;
      }
  
      // Move to next input if a digit is entered
      if (value && index < inputRef.current.length - 1) {
        inputRef.current[index + 1].focus();
      }
    };
    const handleKeydown = (e, index) => {
      if (e.key === "Backspace" && index > 0 && e.target.value.length === 0) {
        inputRef.current[index - 1].focus();
      }
    };
    const handlePaste = (e, startIndex) => {
      e.preventDefault();
      const paste = e.clipboardData.getData("text/plain");
      const pasteArray = paste.split("").filter((char) => /\d/.test(char));
  
      // Fill the input fields starting from the current index
      pasteArray.forEach((char, i) => {
        const currentIndex = startIndex + i;
        if (currentIndex < inputRef.current.length) {
          inputRef.current[currentIndex].value = char;
          // Trigger the input event to handle focus movement
          const inputEvent = new Event("input", { bubbles: true });
          inputRef.current[currentIndex].dispatchEvent(inputEvent);
        }
      });
    };

    const onSubmitEmail = async(e)=>{
      e.preventDefault();
      try {
        const {data} = await axios.post(`${backendUrl}/api/auth/send-reset-otp`, {email})
        if (data.success) {
          toast.success(data.message);
          setIsEmailSent(true);
          setOtp("");
          // Clear any existing OTP inputs
          if (inputRef.current) {
            inputRef.current.forEach(input => {
              if (input) input.value = '';
            });
          }
        } else {
          toast.error(data.message);
        }
        
      } catch (error) {
        console.log(error)
        toast.error(error.response?.data?.message || "Error sending OTP")
      }
    }

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-50 to-indigo-100">
      <img onClick={()=> navigate("/")} src={assets.logo} alt="" className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"/>
      
      {/* Email Form */}
      {!isEmailSent &&  
        <form onSubmit={onSubmitEmail} className='bg-slate-900 p-10 rounded-lg shadow-2xl shadow-indigo-200 w-full sm:w-96 text-sm'>
          <h1 className='text-white text-3xl font-semibold text-center mb-3'>
            Reset Password
          </h1>
          <p className='text-center text-indigo-300 mb-8'>
            Enter your registered email to receive a verification code.
          </p>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] transition-all duration-300 focus-within:ring-2 focus-within:ring-indigo-500' >
            <img src={assets.mail_icon} alt="" />
            <input type="email" placeholder='Email Address' className='bg-transparent outline-none text-white w-full' value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <button type='submit' className='w-full mt-4 py-2.5 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-800 text-white font-medium transition-all duration-300 hover:from-indigo-600 hover:to-indigo-800 hover:shadow-lg hover:shadow-indigo-500/50'>
            Send Code
          </button>
        </form>
      } 

      {/* OTP Input Form */}
      {!isOtpSubmitted && isEmailSent && 
        <form
            onSubmit={async (e) => {
              e.preventDefault();
              const otpValue = Array(6).fill(0).map((_, i) => inputRef.current[i]?.value || '').join('');
              if (otpValue.length !== 6) {
                toast.error('Please enter the 6-digit OTP');
                return;
              }
              try {
                const { data } = await axios.post(`${backendUrl}/api/auth/verify-reset-otp`, { email: email.trim(), otp: otpValue });
                if (data.success) {
                  toast.success('OTP verified successfully');
                  setIsOtpSubmitted(true);
                  setOtp(otpValue);
                } else {
                  toast.error(data.message || 'Invalid OTP');
                }
              } catch (error) {
                console.error('OTP verification error:', error);
                toast.error(error.response?.data?.message || 'Error verifying OTP');
              }
            }}
            className="bg-slate-900 p-10 rounded-lg shadow-2xl shadow-indigo-200 w-full sm:w-auto text-sm"
          >
            <h2 className="text-3xl font-semibold text-white text-center mb-3">
              Enter Verification Code
            </h2>
            <p className="text-center text-indigo-300 text-sm mb-8">
              Enter the 6-digit code sent to {email}.
            </p>
            <div className="flex justify-center gap-3 mb-8" onPaste={(e) => handlePaste(e, 0)}>
              {Array(6).fill(0).map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    className="w-12 h-14 bg-[#333A5C] border-2 border-transparent focus:border-indigo-500 text-2xl rounded-lg text-center text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    ref={(e) => (inputRef.current[index] = e)}
                    onInput={(e) => handleinput(e, index)}
                    onKeyDown={(e) => handleKeydown(e, index)}
                    onPaste={(e) => handlePaste(e, index)}
                  />
                ))}
            </div>
            <button type="submit" className="w-full py-2.5 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-800 text-white font-medium transition-all duration-300 hover:from-indigo-600 hover:to-indigo-800 hover:shadow-lg hover:shadow-indigo-500/50">
              Verify OTP
            </button>
        </form>
      }
        
      {/* New Password Form */}
      {isOtpSubmitted && isEmailSent && 
          <form onSubmit={async (e) => {
            e.preventDefault();
            if (!newPassword) {
              toast.error('Please enter a new password');
              return;
            }
            try {
              const otpValue = otp || Array(6).fill(0).map((_, i) => inputRef.current[i]?.value || '').join('');
              const { data } = await axios.post(`${backendUrl}/api/auth/reset-password`, { email: email.trim(), otp: otpValue, password: newPassword });
              if (data.success) {
                toast.success('Password reset successfully');
                setEmail('');
                setNewPassword('');
                setOtp('');
                setIsEmailSent(false);
                setIsOtpSubmitted(false);
                navigate('/login');
              } else {
                toast.error(data.message || 'Failed to reset password');
              }
            } catch (error) {
              console.error('Password reset error:', error);
              toast.error(error.response?.data?.message || 'Error resetting password');
            }
          }} className='bg-slate-900 p-10 rounded-lg shadow-2xl shadow-indigo-200 w-full sm:w-96 text-sm'>
          <h1 className='text-white text-3xl font-semibold text-center mb-3'>
            Set New Password
          </h1>
          <p className='text-center text-indigo-300 mb-8'>
            Create a new, secure password for your account.
          </p>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] transition-all duration-300 focus-within:ring-2 focus-within:ring-indigo-500' >
            <img src={assets.lock_icon} alt="" />
            <input type="password" placeholder='New Password' className='bg-transparent outline-none text-white w-full' value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
          </div>
          <button type='submit' className='w-full mt-4 py-2.5 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-800 text-white font-medium transition-all duration-300 hover:from-indigo-600 hover:to-indigo-800 hover:shadow-lg hover:shadow-indigo-500/50'>
            Reset Password
          </button>
        </form>
      }
    </div>
  );
}

export default ResetPassword