import { useState, useEffect } from "react";
import bgImage from '@/assets/images/TutorReminiLogin.jpg';
import otpIcon from '@/assets/icons/otp.png';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../../Spinner/Spinner';
import { tutorEndpoints } from '../../../constraints/endpoints/TutorEndpoints'; // Adjust endpoint import as needed
import axios from "axios";

type FormValues = {
  otp: string;
};

function TutorOtp() {
  const { register, handleSubmit, formState: { errors }, setError } = useForm<FormValues>();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [timer, setTimer] = useState<number>(() => { 
    const savedTime = localStorage.getItem('tutorOtpTimer');
    return savedTime ? Number(savedTime) : 60;  // Initialize timer from localStorage or default to 60 seconds
  });
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(false);
   const [isMobile, setIsMobile] = useState(false);

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
        setTimer(prevTimer => {
          const newTimer = prevTimer - 1;
          localStorage.setItem('tutorOtpTimer', newTimer.toString()); // Save updated timer value
          return newTimer;
        });
      }, 1000);

      return () => clearInterval(countdown); // Cleanup timer on component unmount
    } else {
      setIsResendDisabled(false); // Enable resend button when timer reaches 0
      setIsSubmitDisabled(true); // Disable submit button when timer reaches 0
      localStorage.setItem('tutorOtpTimer', "0"); // Ensure timer is stored as 0
    }
  }, [timer]);

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const tempId = localStorage.getItem('tutor-id');
      const idObj = { id: tempId };
      const output = await axios.post(tutorEndpoints.resendOtp, idObj); // Adjust endpoint
      console.log(output, "Resent OTP successfully");

      // After successfully resending OTP, reset the timer
      setTimer(60);  // Reset the timer to 60 seconds
      setIsResendDisabled(true);  // Disable the resend button again
      setIsSubmitDisabled(false); // Enable the submit button again
      localStorage.setItem('tutorOtpTimer', '60');  // Update local storage with new timer value
    } catch (error) {
      console.log("Error resending OTP:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const forgotCheck = JSON.parse(localStorage.getItem('tutor-forgotPass') || 'false');
      setLoading(true);
      console.log("OTP submitted:", data);

      const tempId = localStorage.getItem('tutor-id');

      console.log(tempId,"999999999999999999999999999999999999999999999999")
      const sendObj = {
        otp: data.otp,
        id: tempId
      };

      console.log(tempId)

      if (forgotCheck) {
        console.log("entered to the if")
        const result = await axios.post(tutorEndpoints.forgotOtpVerify, sendObj); // Adjust endpoint
        console.log("Result received", result);

        if (result.data.success) {
          setLoading(false);
          navigate("/tutor/resetPassword"); // Adjust the navigation path as needed
          localStorage.removeItem('tutor-forgotPass'); // Remove forgotPass from local storage
        } else {
          if (result.data.message === "Incorrect Otp") {
            setLoading(false);
            setError("otp", {
              type: "manual",
              message: "Incorrect OTP",
            });
          } else {
            setLoading(false);
            setError("otp", {
              type: "manual",
              message: result.data.message || "Invalid OTP",
            });
          }
        }
      } else {
        console.log("entered to the else")
        const result = await axios.post(tutorEndpoints.otp, sendObj); // Adjust endpoint
        console.log("Result received", result);

        if (result.data.success) {
          setLoading(false);
          console.log(result.data,"check check 0000")
          localStorage.setItem("tutorId",result.data.id)
          navigate("/tutor/addInformation"); 
        } else {
          if (result.data.message === "Incorrect Otp") {
            setLoading(false);
            setError("otp", {
              type: "manual",
              message: "Incorrect OTP",
            });
          } else if (result.data.message === "User data is missing in the temporary record") {
            setLoading(false);
            setError("otp", {
              type: "manual",
              message: "Enter the email Again",
            });
          } else {
            setLoading(false);
            setError("otp", {
              type: "manual",
              message: result.data.message || "Invalid OTP",
            });
          }
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
        className={`flex justify-center items-center min-h-screen relative ${
          isMobile ? "bg-cover bg-center" : "bg-gray-100"
        }`}
        style={isMobile ? { backgroundImage: `url(${bgImage})` } : {}}
      >
        {/* Desktop background */}
        {!isMobile && (
          <>
            <div className="absolute top-0 left-0 h-screen w-[70vw] bg-[#1ecae1] z-10"></div>
            <div className="absolute top-0 right-0 h-screen w-[56vw] bg-white z-10">
              <img
                className="h-full w-[67vw] object-cover absolute top-0 right-0"
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
              : "top-[5vh] left-[10vw] min-h-[90vh] w-[40vw] bg-white"
          } z-20 flex flex-col items-center justify-start py-8`}
        >
          <div className="flex flex-col items-center mb-8">
            <img className="w-14 h-14 mb-4" src={otpIcon} alt="Lock Icon" />
            <div className="text-center">
              <h1 className="text-xl font-bold">OTP VERIFICATION</h1>
              <p className="text-base">Please enter your OTP</p>
            </div>
          </div>
  
          <form className="w-4/5 flex flex-col items-center" onSubmit={handleSubmit(onSubmit)} noValidate>
            <input
              type="password"
              placeholder="OTP"
              {...register('otp', {
                required: 'OTP is required',
                pattern: {
                  value: /^[0-9]+$/,
                  message: 'OTP must be only numbers',
                },
                minLength: {
                  value: 6,
                  message: 'OTP must be exactly 6 digits',
                },
              })}
              disabled={isSubmitDisabled}
              className={`w-full py-3 mb-4 rounded border ${
                errors.otp ? 'border-red-500' : 'border-gray-300'
              } text-base ${isSubmitDisabled ? 'bg-gray-300' : ''}`}
            />
            {errors.otp && <p className="text-red-500 text-sm mb-2">{errors.otp.message}</p>}
  
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className={`w-full py-3 rounded bg-[#1ecae1] text-white font-medium hover:bg-[#17b2cc] mb-4 ${
                isSubmitDisabled ? 'bg-gray-300 cursor-not-allowed' : ''
              }`}
            >
              Submit
            </button>
          </form>
  
          <p>{`Resend OTP in ${timer} seconds`}</p>
          <button
            onClick={handleResendOtp}
            disabled={isResendDisabled}
            className={`${isResendDisabled ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600'}`}
          >
            Resend OTP
          </button>
  
          <p>
            Already have an account?{' '}
            <a href="/tutor/login" className="text-blue-600">
              Log in
            </a>
          </p>
        </div>
      </div>
    )}
  </>
  

  
  );
}

export default TutorOtp;
