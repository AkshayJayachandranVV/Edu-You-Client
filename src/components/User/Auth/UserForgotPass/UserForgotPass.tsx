import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import './UserForgotPass.css';
import bgImage from '../../../../assets/images/UserLogin-Background.jpg';
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

  useEffect(() => {
    const token = localStorage.getItem('userAccessToken');
    if (token) {
      navigate("/");
    }
  }, [navigate]);

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
        <div className='full-background'>
          <div className='input-part'>
            <div className='input-Head'>
              <img className='icon' src={forgotIcon} alt="Lock Icon" />
              <div className='input-Header'>
                <h1>Forgot Password</h1>
                <p>Please enter your email</p>
              </div>
            </div>
            <form className='form-container' onSubmit={handleSubmit(onSubmit)}>
              <input
                type='email'
                placeholder='Email'
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Please enter a valid email address',
                  },
                })}
                className={errors.email ? 'input-with-error' : ''}
              />
              <p className='error-message'>{errors.email?.message}</p>
              <button type='submit'>Submit</button>
            </form>
            <p>Already have an account? <a href="#">Log in</a></p>
          </div>
          <div className='left-background'></div>
          <div className='right-background'>
            <img className='image-background' src={bgImage} alt="Background" />
          </div>
        </div>
      )}
    </>
  );
}

export default UserForgotPass;
