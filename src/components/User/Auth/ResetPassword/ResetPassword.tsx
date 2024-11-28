import  { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useNavigate } from "react-router-dom";
import bgImage from "../../../../assets/images/UserLogin-Background.jpg";
import resetIcon from "../../../../assets/icons/User/UserLoginLock.png";
import Spinner from '../../../Spinner/Spinner';
import { userEndpoints } from '../../../constraints/endpoints/userEndpoints';
import axios from "axios";

type formValues = {
  newPassword: string;
  confirmPassword: string;
};

function ResetPassword() {
  const form = useForm<formValues>();
  const { register, control, handleSubmit, formState, setError } = form;
  const { errors } = formState;
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false); 



  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const onSubmit = async (data: formValues) => {
    if (data.newPassword !== data.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }

    try {
      setLoading(true);
      console.log("form submitted", data);
      const email = localStorage.getItem('email') 

      const result = await axios.post(userEndpoints.resetPassword, {
        newPassword: data.newPassword,
        email : email
      });

      console.log(result);

      if (result.data.success) {
        setLoading(false);
        navigate("/login");
      } else {
        setLoading(false);
        setError("newPassword", {
          type: "manual",
          message: "Password reset failed",
        });
      }
    } catch (error) {
      setLoading(false);
      setError("newPassword", {
        type: "manual",
        message: "Network error, please try again later",
      });
      console.log("error while on submit", error);
    }
  };

  return (
    <>
  {isLoading ? (
    <Spinner />
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
          <div className="hidden md:block fixed top-0 left-0 h-screen w-[70vw] bg-[#232536] z-10"></div>
          <div className="hidden md:block fixed top-0 right-0 h-[120vh] w-[56vw] bg-white z-10">
            <img
              className="absolute top-0 right-0 h-full w-[67vw] object-fill"
              src={bgImage}
              alt="Background"
            />
          </div>
        </>
      )}

      {/* Reset Content */}
      <div
        className={`absolute z-20 ${
          isMobile
            ? "inset-0 flex items-center justify-center bg-transparent"
            : "top-[8vh] left-[10vw] h-[80vh] w-[41vw] bg-white"
        } shadow-lg flex flex-col items-center pt-8 rounded-lg`}
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <img
            className={`w-16 h-16 mb-4 ${isMobile ? "opacity-80" : ""}`}
            src={resetIcon}
            alt="Lock Icon"
          />
          <div className="text-center">
            <h1
              className={`${
                isMobile ? "text-xl text-white" : "text-2xl text-black"
              } font-bold mb-2`}
            >
              RESET PASSWORD
            </h1>
            <p
              className={`${
                isMobile ? "text-sm text-white/80" : "text-lg text-gray-600"
              }`}
            >
              Please enter your new password
            </p>
          </div>
        </div>

        {/* Form */}
        <form
          className="w-[80%] flex flex-col items-center"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {/* New Password Input */}
          <input
            type="password"
            placeholder="New Password"
            {...register("newPassword", {
              required: "New Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className={`w-full p-3 mb-2 rounded border ${
              isMobile
                ? "bg-transparent text-white placeholder-white border-2 border-white"
                : "bg-gray-50 text-black placeholder-gray-500 border-gray-400"
            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
          {errors.newPassword && (
            <p className="text-red-500 text-sm mb-2">{errors.newPassword.message}</p>
          )}

          {/* Confirm Password Input */}
          <input
            type="password"
            placeholder="Confirm Password"
            {...register("confirmPassword", {
              required: "Confirm Password is required",
            })}
            className={`w-full p-3 mb-2 rounded border ${
              isMobile
                ? "bg-transparent text-white placeholder-white border-2 border-white"
                : "bg-gray-50 text-black placeholder-gray-500 border-gray-400"
            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mb-2">{errors.confirmPassword.message}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full p-3 rounded ${
              isMobile
                ? "bg-white text-[#232536] hover:bg-gray-200"
                : "bg-[#232536] text-white hover:bg-[#384d60]"
            } text-base mb-4`}
          >
            Reset Password
          </button>
        </form>
        <DevTool control={control} />
      </div>
    </div>
  )}
</>

  
  );
}

export default ResetPassword;
