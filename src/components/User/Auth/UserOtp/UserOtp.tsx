import { useState, useEffect } from "react";
import bgImage from "../../../../assets/images/UserLogin-Background.jpg";
import otpIcon from "@/assets/icons/User/OtpIcon.png";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Spinner from "../../../Spinner/Spinner";
import { userEndpoints } from "../../../constraints/endpoints/userEndpoints";
import axios from "axios";

type FormValues = {
  otp: string;
};

function OtpVerification() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormValues>();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [timer, setTimer] = useState<number>(() => {
    const savedTime = localStorage.getItem("otpTimer");
    return savedTime ? Number(savedTime) : 60; // Initialize timer from localStorage or default to 60 seconds
  });
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => {
          const newTimer = prevTimer - 1;
          localStorage.setItem("otpTimer", newTimer.toString()); // Save updated timer value
          return newTimer;
        });
      }, 1000);

      return () => clearInterval(countdown); // Cleanup timer on component unmount
    } else {
      setIsResendDisabled(false); // Enable resend button when timer reaches 0
      setIsSubmitDisabled(true); // Disable submit button when timer reaches 0
      localStorage.setItem("otpTimer", "0"); // Ensure timer is stored as 0
    }
  }, [timer]);

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const tempId = localStorage.getItem("id");
      const idObj = { id: tempId };
      const output = await axios.post(userEndpoints.resendOtp, idObj);
      console.log(output, "Resent OTP successfully");

      // After successfully resending OTP, reset the timer
      setTimer(60); // Reset the timer to 60 seconds
      setIsResendDisabled(true); // Disable the resend button again
      setIsSubmitDisabled(false); // Enable the submit button again
      localStorage.setItem("otpTimer", "60"); // Update local storage with new timer value
    } catch (error) {
      console.log("Error resending OTP:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const forgotCheck = JSON.parse(
        localStorage.getItem("forgotPass") || "false"
      );

      console.log(forgotCheck, "forgot check vakue getyting");

      if (forgotCheck) {
        setLoading(true);
        console.log("OTP submitted:", data);

        const tempId = localStorage.getItem("id");
        const sendObj = {
          otp: data.otp,
          id: tempId,
        };

        const result = await axios.post(userEndpoints.forgotOtpVerify, sendObj);
        console.log("Result received", result);
        console.log("Result of the message", result.data.message);

        if (result.data.success) {
          setLoading(false);
          navigate("/resetPassword");
          // localStorage.removeItem("id")
          localStorage.removeItem("forgotPass"); // Remove forgotPass from local storage
        } else {
          if (result.data.message == "Incorrect Otp") {
            setLoading(false);
            setError("otp", {
              type: "manual",
              message: "Incorrect OTP",
            });
          }
          setLoading(false);
          setError("otp", {
            type: "manual",
            message: "Invalid OTP",
          });
        }
      } else {
        setLoading(true);
        console.log("OTP submitted:", data);

        const tempId = localStorage.getItem("id");
        const sendObj = {
          otp: data.otp,
          id: tempId,
        };

        const result = await axios.post(userEndpoints.otp, sendObj);
        console.log("Result received", result);
        console.log("Result of the message", result.data.message);

        if (result.data.success) {
          setLoading(false);
          navigate("/login");
          // localStorage.removeItem("id")
          localStorage.removeItem("forgotPass"); // Remove forgotPass from local storage
        } else {
          if (result.data.message == "Incorrect Otp") {
            setLoading(false);
            setError("otp", {
              type: "manual",
              message: "Incorrect OTP",
            });
          }
          setLoading(false);
          setError("otp", {
            type: "manual",
            message: "Invalid OTP",
          });
        }
      }
    } catch (error) {
      setLoading(false);
      console.log("Error in OTP verification:", error);

      setError("otp", {
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
          isMobile ? "bg-cover bg-center" : "bg-[#f0f4f8]"
        } relative`}
        style={isMobile ? { backgroundImage: `url(${bgImage})` } : {}}
      >
        {/* Backgrounds for larger screens */}
        {!isMobile && (
          <>
            <div className="hidden md:block fixed top-0 left-0 h-screen w-[70vw] bg-[#232536] z-10"></div>
            <div className="hidden md:block fixed top-0 right-0 h-[120vh] w-[56vw] bg-white z-10">
              <img
                className="absolute top-0 right-0 h-screen w-[67vw] object-cover"
                src={bgImage}
                alt="Background"
              />
            </div>
          </>
        )}
  
        {/* OTP Input Section */}
        <div
          className={`absolute z-20 flex flex-col items-center justify-start ${
            isMobile
              ? "inset-0 bg-transparent justify-center h-full w-full"
              : "top-[12vh] left-[10vw] md:min-h-[75vh] w-[90%] md:w-[40vw] bg-white"
          } pt-8 pb-8 shadow-lg rounded-lg`}
        >
          <div className="flex flex-col items-center mb-8">
            <img
              className={`w-20 h-20 mb-4 ${isMobile ? "opacity-80" : ""}`}
              src={otpIcon}
              alt="Lock Icon"
            />
            <div>
              <h1
                className={`text-2xl font-bold text-center ${
                  isMobile ? "text-white/90" : "text-black"
                }`}
              >
                OTP VERIFICATION
              </h1>
              <p
                className={`text-lg text-center ${
                  isMobile ? "text-white/70" : "text-black"
                }`}
              >
                Please enter your OTP
              </p>
            </div>
          </div>
  
          {/* OTP Form */}
          <form
            className="w-[80%] flex flex-col items-center"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <input
              type="password"
              placeholder="OTP"
              {...register("otp", {
                required: "OTP is required",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "OTP must be only numbers",
                },
                minLength: {
                  value: 6,
                  message: "OTP must be exactly 6 digits",
                },
              })}
              disabled={isSubmitDisabled}
              className={`w-full px-4 py-3 rounded border text-base mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                isSubmitDisabled
                  ? "bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed"
                  : isMobile
                  ? "bg-transparent text-white placeholder-white border-2 border-white"
                  : "bg-white text-black placeholder-gray-400 border-gray-300"
              }`}
            />
            {errors.otp && (
              <p className="text-red-500 text-sm mb-4">{errors.otp.message}</p>
            )}
  
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className={`w-full px-4 py-3 rounded text-white text-base mb-4 ${
                isSubmitDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#232536] hover:bg-[#384d60]"
              }`}
            >
              Submit
            </button>
          </form>
  
          <p
            className={`text-center mb-4 ${
              isMobile ? "text-white/80" : "text-black"
            }`}
          >{`Resend OTP in ${timer} seconds`}</p>
          <button
            onClick={handleResendOtp}
            disabled={isResendDisabled}
            className={`px-4 py-2 rounded text-base ${
              isResendDisabled
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-indigo-500 text-white hover:bg-indigo-600"
            }`}
          >
            Resend OTP
          </button>
          <p
            className={`mt-4 text-sm ${
              isMobile ? "text-white" : "text-black"
            }`}
          >
            Already have an account?{" "}
            <a
              href="/login"
              className={`underline ${
                isMobile
                  ? "text-indigo-300"
                  : "text-indigo-600 hover:text-indigo-800"
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

export default OtpVerification;
