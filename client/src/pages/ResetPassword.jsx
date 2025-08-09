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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-400">
    <img onClick={()=> navigate("/")} src={assets.logo} alt="" className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"/>
    {!isEmailSent &&  
    <form onSubmit={onSubmitEmail} className='bg-slate-900 p-8 rounded-md shadow-lg w-96 text-sm'>
      <h1 className='text-white text-2xl font-semibold text-center mb-4'>
        Reset Password
      </h1>
      <p className='text-center text-indigo-300 mb-6'>
        Enter your registered email address
      </p>
      <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]' >
        <img src={assets.mail_icon} alt="" />
        <input type="email" placeholder='Email' className='bg-transparent outline-none text-white' value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <button type='submit' className='w-full py-2.5 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-900 text-white font-medium hover:bg-indigo-600 transition-all duration-300'>
        Submit
      </button>

    </form>
} 
    {/* otp input form */}
{!isOtpSubmitted && isEmailSent && 
    <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            const otpValue = Array(6).fill(0).map((_, i) => 
              inputRef.current[i]?.value || ''
            ).join('');
            
            if (otpValue.length !== 6) {
              toast.error('Please enter a valid 6-digit OTP');
              return;
            }
            
            const { data } = await axios.post(`${backendUrl}/api/auth/verify-reset-otp`, {
              email: email.trim(),
              otp: otpValue
            });
            
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
        className="bg-slate-900 p-8 rounded-md shadow-lg w-96 text-sm"
      >
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          Reset Password OTP
        </h2>
        <p className="text-center text-gray-400 text-sm mb-6">
          Enter the verification code sent to your email
        </p>
        <div
          className="flex justify-between mb-8"
          onPaste={(e) => handlePaste(e, 0)}
        >
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                key={`otp-input-${index}`}
                type="number"
                pattern="\d*"
                inputMode="numeric"
                className="w-12 h-12 border border-gray-500 text-xl rounded-md text-center text-white hover:bg-gray-100 hover:text-black transition-all duration-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                ref={(e) => (inputRef.current[index] = e)}
                onInput={(e) => handleinput(e, index)}
                onKeyDown={(e) => handleKeydown(e, index)}
                onPaste={(e) => handlePaste(e, index)}
              />
            ))}
        </div>
        <button
          type="submit"
          className="w-full py-2.5 rounded-md bg-gradient-to-br from-indigo-500 to-indigo-900 text-white font-medium hover:bg-indigo-600 transition-all duration-300"
        >
          Verify OTP
        </button>
      </form>
    
}
    
{isOtpSubmitted && isEmailSent && 
      <form onSubmit={async (e) => {
        e.preventDefault();
        if (!newPassword) {
          toast.error('Please enter a new password');
          return;
        }
        
        try {
          const otpValue = otp || Array(6).fill(0).map((_, i) => 
            inputRef.current[i]?.value || ''
          ).join('');
          
          const { data } = await axios.post(`${backendUrl}/api/auth/reset-password`, {
            email: email.trim(),
            otp: otpValue,
            password: newPassword
          });
          
          if (data.success) {
            toast.success('Password reset successfully');
            // Reset all states
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
      }} className='bg-slate-900 p-8 rounded-md shadow-lg w-96 text-sm'>
      <h1 className='text-white text-2xl font-semibold text-center mb-4'>
        New Password
      </h1>
      <p className='text-center text-indigo-300 mb-6'>
        Enter your new password
      </p>
      <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]' >
        <img src={assets.lock_icon} alt="" />
        <input type="password" placeholder='New Password' className='bg-transparent outline-none text-white' value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
      </div>
      <button type='submit' className='w-full py-2.5 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-900 text-white font-medium hover:bg-indigo-600 transition-all duration-300'>
        Submit
      </button>

    </form>
}
    </div>
  )
}

export default ResetPassword