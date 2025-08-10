import React, { useContext, useEffect } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const EmailVerify = () => {
  axios.defaults.withCredentials = true;
  const { backendUrl, isLoggedin, userData, getUserData } =
    useContext(AppContext);
    
    const navigate = useNavigate();
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
  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRef.current.map((e) => e.value);
      const otp = otpArray.join("");
      const { data } = await axios.post(
        `${backendUrl}/api/auth/verify-account`,
        { otp }
      );
      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error verifying account");
    }
  };
  useEffect(() => {
    isLoggedin && userData && userData.isAccountVerified && navigate("/");
  }, [isLoggedin, userData]);
  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-50 to-indigo-100">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <form
        onSubmit={onSubmitHandler}
        className="bg-slate-900 p-10 rounded-lg shadow-2xl shadow-indigo-200 w-full sm:w-auto text-sm"
      >
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          Verify Your Email
        </h2>
        <p className="text-center text-indigo-300 text-sm mb-8">
          Enter the 6-digit code sent to your email address.
        </p>
        <div
          className="flex justify-center gap-3 mb-8"
          onPaste={(e) => handlePaste(e, 0)}
        >
          {Array(6)
            .fill(0)
            .map((_, index) => (
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
        <button
          type="submit"
          className="w-full py-2.5 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-800 text-white font-medium transition-all duration-300 hover:from-indigo-600 hover:to-indigo-800 hover:shadow-lg hover:shadow-indigo-500/50"
        >
          Verify Account
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
