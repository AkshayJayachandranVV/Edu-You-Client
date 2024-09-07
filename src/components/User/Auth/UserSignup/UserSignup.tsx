import React, { useState, useEffect } from "react";
import "./UserSignup.css";
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
  const [isLoading,setLoading] = useState(false)
  const { register, control, handleSubmit, formState, setError } = form;
  const { errors } = formState;
  const navigate = useNavigate();

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
    {isLoading ? (<Spinner />) :(
    <div className="signup-full-background">
      <div className="signup-input-part">
        <div className="signup-input-Head">
          <img className="signup-icon" src={signupIcon} alt="Signup Icon" />
          <div className="signup-input-Header">
            <h1>Registration</h1>
            <p>Please sign up to access your account</p>
          </div>
        </div>
        <form
          className="signup-form-container"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <input
            type="text"
            placeholder="Username"
            className={errors.username ? 'login-input-with-error' : ''}
            {...register("username", {
              required: "Username is required",
              minLength: {
                value: 3,
                message: "Username must be at least 3 characters",
              },
            })}
          />
          <p className="signup-error-message">{errors.username?.message}</p>

          <input
            type="email"
            placeholder="Email"
            className={errors.email ? 'signup-input-with-error' : ''}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Please enter a valid email address",
              },
            })}
          />
          <p className="signup-error-message">{errors.email?.message}</p>

          <input
            type="password"
            placeholder="Password"
            className={errors.password ? 'signup-input-with-error' : ''}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          <p className="signup-error-message">{errors.password?.message}</p>

          <input
            type="password"
            placeholder="Confirm Password"
            className={errors.confirmPassword ? 'signup-input-with-error' : ''}
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === form.watch("password") || "Passwords do not match",
            })}
          />
          <p className="signup-error-message">{errors.confirmPassword?.message}</p>

          <a href="#" className="signup-forgot-link">
            Forgot Password?
          </a>
          <button type="submit">Sign Up</button>
        </form>
        <DevTool control={control} />
        <p>
          Already have an account? <a href="/logi">Log in</a>
        </p>
      </div>
      <div className="signup-left-background"></div>
      <div className="signup-right-background">
        <img className="signup-image-background" src={bgImage} alt="Background" />
      </div>
    </div>
     )}
    </>
  );
}

export default UserSignup;
