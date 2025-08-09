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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <form
        onSubmit={onSubmitHandler}
        className="bg-slate-900 p-8 rounded-md shadow-lg w-96 text-sm"
      >
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          Verify Email
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
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
