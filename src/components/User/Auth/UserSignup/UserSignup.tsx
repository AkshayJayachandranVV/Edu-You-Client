import  { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bgImage from "../../../../assets/images/UserLogin-Background.jpg";
import signupIcon from "../../../../assets/icons/User/UserSignup.png";
import Spinner from '../../../Spinner/Spinner'
import {userEndpoints} from '../../../constraints/endpoints/userEndpoints'

type formValues = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

function UserSignup() {
  const form = useForm<formValues>();
  const [isLoading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // Mobile state
  const { register, control, handleSubmit, formState, setError,watch } = form;
  const { errors } = formState;
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('userAccessToken');
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const onSubmit = async (data: formValues) => {
    try { 
      const timer = localStorage.getItem("otpTimer")
      if(timer==="0"){
        localStorage.removeItem("otpTimer")
      }
      console.log("form submitted", data);
      setLoading(true)

      const { confirmPassword, ...userDataWithoutConfirmPassword } = data;

      console.log(confirmPassword)



      const result = await axios.post(userEndpoints.register, userDataWithoutConfirmPassword);

      console.log("got the result -----0", result);

      console.log(result.data.success);

      if (result.data.success) {
        setLoading(false)
        localStorage.removeItem("otpTimer")
        localStorage.setItem('id', result.data.tempId);
        localStorage.setItem('email', result.data.userData.email);
        navigate("/otp");
      } else {
        setLoading(false)
        setError("email", {
          type: "manual",
          message: "Email already exists",
        });
      }
    } catch (error) {
      setLoading(false)
      console.error("Error during registration:", error);
      setError("email", {
        type: "manual",
        message: "Network error, please try again later",
      });
    }
  };

  return (
    <>
    {isLoading ? (
      <Spinner />
    ) : (
      <div
        className={`h-[120vh] w-full flex justify-center items-center ${
          isMobile ? "bg-cover bg-center" : "bg-gray-100"
        } relative`}
        style={isMobile ? { backgroundImage: `url(${bgImage})` } : {}}
      >
        {/* Desktop background */}
        {!isMobile && (
          <>
            <div className="hidden lg:block fixed top-0 left-0 h-screen w-[70vw] bg-[#232536] z-10"></div>
            <div className="hidden lg:block fixed top-0 right-0 h-[120vh] w-[56vw] bg-white z-10">
              <img
                className="absolute top-0 right-0 h-screen w-[67vw] object-cover"
                src={bgImage}
                alt="Background"
              />
            </div>
          </>
        )}
  
        {/* Form container */}
        <div
          className={`absolute ${
            isMobile
              ? "inset-0 flex items-center justify-center bg-transparent"
              : "top-[8vh] left-[10vw] h-[95vh] w-[41vw] bg-white"
          } z-20 flex flex-col items-center justify-start pt-8 rounded-lg shadow-lg`}
        >
          <div className="flex flex-col items-center mb-8">
            <img
              className={`w-16 h-16 mb-4 ${isMobile ? "opacity-80" : ""}`}
              src={signupIcon}
              alt="Signup Icon"
            />
            <div>
              <h1
                className={`text-lg text-center ${
                  isMobile ? "text-white/90" : "text-black"
                }`}
              >
                Registration
              </h1>
              <p
                className={`text-sm text-center ${
                  isMobile ? "text-white/70" : "text-black"
                }`}
              >
                Please sign up to access your account
              </p>
            </div>
          </div>
          <form
            className="w-[80%] flex flex-col items-center"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            {/* Username Input */}
            <input
              type="text"
              placeholder="Username"
              {...register("username", {
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters",
                },
              })}
              className={`w-full p-3 mb-2 rounded border ${
                isMobile
                  ? "bg-transparent text-white placeholder-white border-2 border-white"
                  : "bg-gray-50 text-black placeholder-gray-500 border-gray-400"
              } focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base`}
            />
            <p className="text-red-500 text-sm w-full mt-1 mb-1 text-left">
              {errors.username?.message}
            </p>
  
            {/* Email Input */}
            <input
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Enter a valid email address",
                },
              })}
              className={`w-full p-3 mb-2 rounded border ${
                isMobile
                  ? "bg-transparent text-white placeholder-white border-2 border-white"
                  : "bg-gray-50 text-black placeholder-gray-500 border-gray-400"
              } focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base`}
            />
            <p className="text-red-500 text-sm w-full mt-1 mb-1 text-left">
              {errors.email?.message}
            </p>
  
            {/* Password Input */}
            <input
              type="password"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              })}
              className={`w-full p-3 mb-2 rounded border ${
                isMobile
                  ? "bg-transparent text-white placeholder-white border-2 border-white"
                  : "bg-gray-50 text-black placeholder-gray-500 border-gray-400"
              } focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base`}
            />
            <p className="text-red-500 text-sm w-full mt-1 mb-1 text-left">
              {errors.password?.message}
            </p>
  
            {/* Confirm Password Input */}
            <input
              type="password"
              placeholder="Confirm Password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
              className={`w-full p-3 mb-2 rounded border ${
                isMobile
                  ? "bg-transparent text-white placeholder-white border-2 border-white"
                  : "bg-gray-50 text-black placeholder-gray-500 border-gray-400"
              } focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base`}
            />
            <p className="text-red-500 text-sm w-full mt-1 mb-1 text-left">
              {errors.confirmPassword?.message}
            </p>
  
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full p-3 rounded bg-[#232536] text-white text-base mb-4 hover:bg-[#17b2cc]"
            >
              Sign Up
            </button>
          </form>
  
          <DevTool control={control} />
          <p
            className={`text-sm mt-4 ${
              isMobile ? "text-[#232536]" : "text-black"
            }`}
          >
            Already have an account?{" "}
            <a href="/login" className="text-[#17b2cc] hover:text-[#17b2cc]">
              Log in
            </a>
          </p>
        </div>
      </div>
    )} G
  </>
  
  );
}

export default UserSignup;
