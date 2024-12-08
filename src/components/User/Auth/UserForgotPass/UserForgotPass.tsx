import  { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import bgImage from '../../../../assets/images/UserLogin-Background.jpg'
import forgotIcon from '../../../../assets/icons/User/forgot-password.png';
import { userEndpoints } from '../../../constraints/endpoints/userEndpoints';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from '../../../Spinner/Spinner'; // Import your Spinner component

type FormValues = {
  email: string;
};

function UserForgotPass() {
  const { register, handleSubmit, formState: { errors }, setError } = useForm<FormValues>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // State to manage loading
  const [isMobile, setIsMobile] = useState(false); 

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true); // Start loading
    try {
      console.log("entered to the user forgot");
      console.log("Submitted data:", data);
      const result = await axios.post(userEndpoints.forgotPasword, data);

      console.log(result, "00000000000000000000000000000000000");

      if (result.data.success) {
        setIsLoading(false);
        localStorage.removeItem("otpTimer");
        console.log("entered success forgot");
        if (result.data.forgotPass === true) {
          localStorage.setItem('forgotPass', JSON.stringify(result.data.forgotPass));
          localStorage.setItem('id', result.data.tempId);
        }

        navigate("/otp");
      } else {
        setIsLoading(false);
        setError("email", {
          type: "manual",
          message: "User not Found",
        });
      }
    } catch (error) {
      console.error("Error during password reset:", error);
      setError("email", {
        type: "manual",
        message: "An error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <>
    {isLoading ? (
      <Spinner /> // Show spinner while loading
    ) : (
      <div
        className={`h-[120vh] w-full flex justify-center items-center ${
          isMobile ? "bg-cover bg-center" : "bg-[#f0f4f8]"
        } relative`}
        style={isMobile ? { backgroundImage: `url(${bgImage})` } : {}}
      >
        {/* Desktop Background */}
        {!isMobile && (
          <>
            {/* Left Background */}
            <div className="hidden md:block fixed top-0 left-0 h-full w-[70vw] bg-[#232536] z-[1]"></div>
  
            {/* Right Background */}
            <div className="hidden md:block fixed top-0 right-0 h-[120vh] w-[56vw] bg-white z-[1]">
              <img
                className="absolute top-0 right-0 h-full w-[67vw] object-fill"
                src={bgImage}
                alt="Background"
              />
            </div>
          </>
        )}
  
        {/* Input Section */}
        <div
          className={`absolute z-[2] ${
            isMobile
              ? "inset-0 flex items-center justify-center bg-[#00000099]"
              : "w-[90%] md:w-[41vw] min-h-[65vh] top-[15vh] left-[5vw] md:left-[10vw] bg-white"
          } shadow-lg flex flex-col items-center pt-8 rounded-lg`}
        >
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <img
              className={`${
                isMobile ? "w-16 h-16 mb-4 opacity-80" : "w-20 h-20 mb-4"
              }`}
              src={forgotIcon}
              alt="Lock Icon"
            />
            <div className="text-center">
              <h1
                className={`text-2xl font-bold mb-2 ${
                  isMobile ? "text-white" : "text-black"
                }`}
              >
                Forgot Password
              </h1>
              <p
                className={`text-lg ${
                  isMobile ? "text-white/90" : "text-black"
                }`}
              >
                Please enter your email
              </p>
            </div>
          </div>
  
          {/* Form */}
          <form
            className="w-[80%] flex flex-col items-center"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Please enter a valid email address",
                },
              })}
              className={`w-full p-3 rounded mb-4 border text-base focus:outline-none focus:ring-2 ${
                isMobile
                  ? "bg-transparent text-white placeholder-white border-white focus:ring-white"
                  : "bg-gray-50 text-black placeholder-gray-400 border-gray-300 focus:ring-indigo-500"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mb-4">{errors.email.message}</p>
            )}
  
            <button
              type="submit"
              className={`w-full p-3 rounded text-white text-base hover:bg-[#384d60] mb-4 ${
                isMobile ? "bg-[#17b2cc]" : "bg-[#232536]"
              }`}
            >
              Submit
            </button>
          </form>
  
          <p
            className={`text-sm ${
              isMobile ? "text-white" : "text-black"
            } text-center`}
          >
            Already have an account?{" "}
            <a
              href="/login"
              className={`underline ${
                isMobile ? "text-[#17b2cc]" : "text-indigo-600 hover:text-indigo-800"
              }`}
            >
              Log in
            </a>
          </p>
        </div>
      </div>
    )}
  </>
  
  
  );
}

export default UserForgotPass;
