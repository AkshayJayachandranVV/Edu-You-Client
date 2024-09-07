import React, { useState, useEffect } from "react";
import './TutorOtp.css'; // Updated CSS filename
import bgImage from '../../../../assets/images/TutorReminiLogin.jpg';
import otpIcon from '../../../../assets/icons/otp.png';
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

  useEffect(() => {
    const token = localStorage.getItem('tutorAccessToken');
    if (token) {
      navigate("/tutor/dashboard");
    }
  }, [navigate]);



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
          navigate("/tutor/login"); // Adjust the navigation path as needed
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
        <div className='tutorotp-full-background'>
          <div className='tutorotp-input-part'>
            <div className='tutorotp-input-head'>
              <img className='tutorotp-icon' src={otpIcon} alt="Lock Icon" />
              <div className='tutorotp-input-header'>
                <h1>OTP VERIFICATION</h1>
                <p>Please enter your OTP</p>
              </div>
            </div>
            <form className='tutorotp-form-container' onSubmit={handleSubmit(onSubmit)} noValidate>
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
              {errors.otp && <p className='tutorotp-error-message'>{errors.otp.message}</p>}
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
          <div className='tutorotp-left-background'></div>
          <div className='tutorotp-right-background'>
            <img className='tutorotp-image-background' src={bgImage} alt="Background" />
          </div>
        </div>
      )}
    </>
  );
}

export default TutorOtp;
