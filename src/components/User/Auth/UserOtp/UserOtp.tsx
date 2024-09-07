import React, { useState, useEffect } from "react";
import './UserOtp.css'; // Updated CSS filename
import bgImage from '../../../../assets/images/UserLogin-Background.jpg';
import otpIcon from '../../../../assets/icons/User/OtpIcon.png';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../../Spinner/Spinner';
import {userEndpoints} from '../../../constraints/endpoints/userEndpoints'
import axios from "axios";

type FormValues = {
  otp: string;
};

function OtpVerification() {
  const { register, handleSubmit, formState: { errors }, setError } = useForm<FormValues>();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [timer, setTimer] = useState<number>(() => {
    const savedTime = localStorage.getItem('otpTimer');
    return savedTime ? Number(savedTime) : 60;  // Initialize timer from localStorage or default to 60 seconds
  });
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('userAccessToken');
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer(prevTimer => {
          const newTimer = prevTimer - 1;
          localStorage.setItem('otpTimer', newTimer.toString()); // Save updated timer value
          return newTimer;
        });
      }, 1000);

      return () => clearInterval(countdown); // Cleanup timer on component unmount
    } else {
      setIsResendDisabled(false); // Enable resend button when timer reaches 0
      setIsSubmitDisabled(true); // Disable submit button when timer reaches 0
      localStorage.setItem('otpTimer', "0"); // Ensure timer is stored as 0
    }
  }, [timer]);

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const tempId = localStorage.getItem('id');
      const idObj = { id: tempId };
      const output = await axios.post(userEndpoints.resendOtp, idObj);
      console.log(output, "Resent OTP successfully");

      // After successfully resending OTP, reset the timer
      setTimer(60);  // Reset the timer to 60 seconds
      setIsResendDisabled(true);  // Disable the resend button again
      setIsSubmitDisabled(false); // Enable the submit button again
      localStorage.setItem('otpTimer', '60');  // Update local storage with new timer value
    } catch (error) {
      console.log("Error resending OTP:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {

      const forgotCheck = JSON.parse(localStorage.getItem('forgotPass') || 'false');

      console.log(forgotCheck,"forgot check vakue getyting")

   
      if(forgotCheck){

        setLoading(true);
        console.log("OTP submitted:", data);

        const tempId = localStorage.getItem('id');
        const sendObj = {
          otp: data.otp,
          id: tempId
        };
  
        const result = await axios.post(userEndpoints.forgotOtpVerify, sendObj);
        console.log("Result received", result);
        console.log("Result of the message", result.data.message);


        if (result.data.success) {
          setLoading(false);
          navigate("/resetPassword");
          // localStorage.removeItem("id")
          localStorage.removeItem('forgotPass'); // Remove forgotPass from local storage
        } else {
          if(result.data.message == "Incorrect Otp"){
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
        
      }else{
        setLoading(true);
        console.log("OTP submitted:", data);
  
        const tempId = localStorage.getItem('id');
        const sendObj = {
          otp: data.otp,
          id: tempId
        };
  
        const result = await axios.post(userEndpoints.otp, sendObj);
        console.log("Result received", result);
        console.log("Result of the message", result.data.message);
  
        if (result.data.success) {
          setLoading(false);
          navigate("/login");
          // localStorage.removeItem("id")
          localStorage.removeItem('forgotPass'); // Remove forgotPass from local storage
        } else {
          if(result.data.message == "Incorrect Otp"){
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
        <div className='otp-full-background'>
          <div className='otp-input-part'>
            <div className='otp-input-head'>
              <img className='otp-icon' src={otpIcon} alt="Lock Icon" />
              <div className='otp-input-header'>
                <h1>OTP VERIFICATION</h1>
                <p>Please enter your OTP</p>
              </div>
            </div>
            <form className='otp-form-container' onSubmit={handleSubmit(onSubmit)} noValidate>
              <input
                type='password'
                placeholder='OTP'
                {...register('otp', {
                  required: 'OTP is required',
                  pattern: {
                    value: /^[0-9]+$/,
                    message: 'OTP must be only numbers'
                  },
                  minLength: {
                    value: 6,
                    message: 'OTP must be exactly 6 digits'
                  }
                })}
                disabled={isSubmitDisabled} // Disable input when timer reaches 0
                className={isSubmitDisabled ? 'disabled-input' : ''} // Apply disabled style
              />
              {errors.otp && <p className='otp-error-message'>{errors.otp.message}</p>}
              <button 
                type='submit' 
                disabled={isSubmitDisabled} // Disable submit button when timer reaches 0
                className={isSubmitDisabled ? 'disabled-button' : ''} // Apply disabled style
              >
                Submit
              </button>
            </form>
            <p>{`Resend OTP in ${timer} seconds`}</p>
            <button onClick={handleResendOtp} disabled={isResendDisabled}>Resend OTP</button>
            <p>Already have an account? <a href="#">Log in</a></p>
          </div>
          <div className='otp-left-background'></div>
          <div className='otp-right-background'>
            <img className='otp-image-background' src={bgImage} alt="Background" />
          </div>
        </div>
      )}
    </>
  );
}

export default OtpVerification;
