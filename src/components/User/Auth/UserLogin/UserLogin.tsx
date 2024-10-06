import React, {useState,useEffect} from "react";
import "./UserLogin.css";
import Cookies from 'js-cookie';
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useNavigate } from "react-router-dom";
import bgImage from "../../../../assets/images/UserLogin-Background.jpg";
import loginIcon from "../../../../assets/icons/User/UserLoginLock.png";
// import googleIcon from "../../../../assets/icons/google.png";
import Spinner from '../../../Spinner/Spinner'
import {userEndpoints} from '../../../constraints/endpoints/userEndpoints'
import { GoogleLogin, CredentialResponse  } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode"; 
import axios from "axios";
import {useDispatch} from 'react-redux'
import {setUser} from '../../../../redux/userSlice'

type formValues = {
  email: string;
  password: string;
};

function UserLogin() {
  const form = useForm<formValues>();
  const { register, control, handleSubmit, formState, setError } = form;
  const { errors } = formState;
  const navigate = useNavigate();
  const [isLoading,setLoading] = useState(false)
  const dispatch = useDispatch()

  interface DecodedToken {
    // Define the structure of your decoded token here
    email: string;
    name: string;
    // Add other fields based on your token structure
  }

  // useEffect(() => {
  //   const token = localStorage.getItem('userAccessToken');
  //   if (token) {
  //     navigate("/");
  //   }
  // }, [navigate]);


  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    console.log(credentialResponse);
  
    if (credentialResponse.credential) {
      // Decode the JWT token
      const decoded: DecodedToken = jwtDecode<DecodedToken>(credentialResponse.credential);
      console.log(decoded);
  
      const userData = {
        email: decoded.email,
        fullname: decoded.name,
      };
  
      console.log(userData, "userdata");
  
      try {
        // Send the extracted data to your backend
        const result = await axios.post(userEndpoints.googleLogin, userData);
  
        if (result.data.success) {
          console.log(result.data.user_data);
          const { _id, username, email, phone } = result.data.user_data;
          console.log("every data", _id, username, email, phone);
  
          // Dispatch the user data to the Redux store
          dispatch(setUser({ id: _id, username, email, phone }));
          console.log("Successfully logged in using GOOGLE");
  
          // Store the access token in local storage
          localStorage.setItem('userAccessToken', result.data.userAccessToken);
          Cookies.set('userAccessToken', result.data.userAccessToken, { expires: 7 });
  
          // Navigate to the home page
          navigate('/');
        } else if (result.data.message === "User is Blocked") {
          // Display the blocked message when the user is blocked
          alert("You are blocked. Please contact support.");
          console.log("User is blocked");
        } else {
          console.log("Login failed:", result.data.message);
        }
      } catch (error) {
        console.error("Error during Google login:", error);
      }
    } else {
      console.error('Credential response does not contain a valid JWT token');
    }
  };
  





const onSubmit = async (data: formValues) => {
  try {
    setLoading(true);
    console.log("form submitted", data);

    const result = await axios.post(userEndpoints.login, data);

    console.log(result);

    if (result.data.success) {
      console.log(result.data.userData);
      const { _id, username, email, phone } = result.data.userData;
      console.log("every data", _id, username, email, phone);
      
      // Dispatching the user data and storing the access token
      dispatch(setUser({ id: _id, username, email, phone }));
      localStorage.setItem('userAccessToken', result.data.userAccessToken);
      Cookies.set('userAccessToken', result.data.userAccessToken, { expires: 7 });
      setLoading(false);
      navigate("/");
    } else {
      // Handle different error messages from the backend
      setLoading(false);

      if (result.data.message === "Email incorrect") {
        setError("email", {
          type: "manual",
          message: "Incorrect Email",
        });
      } else if (result.data.message === "Incorrect Password") {
        setError("password", {
          type: "manual",
          message: "Incorrect Password",
        });
      } else if (result.data.message === "User is Blocked") {
        // If the user is blocked, display the "You are blocked" message
        setError("email", {
          type: "manual",
          message: "You are blocked. Please contact support.",
        });
      }
    }

    console.log("got the result ", result);
  } catch (error) {
    setLoading(false);
    setError("email", {
      type: "manual",
      message: "Network error, please try again later",
    });
    console.log("error while on submit", error);
  }
};


  return (
    <>
    {isLoading ? (<Spinner />) :(
    <div className="user-login-container">
    <div className="user-login-content">
      <div className="user-login-header">
        <img className="user-login-icon" src={loginIcon} alt="Lock Icon" />
        <div className="user-login-title">
          <h1>LOGIN</h1>
          <p>Please log in to access your account</p>
        </div>
      </div>
      <form className="user-login-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <input
          type="email"
          placeholder="Email"
          className={errors.email ? "user-login-input-error" : "user-login-input"}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Please enter a valid email address",
            },
          })}
        />
        <p className="user-login-error-message">{errors.email?.message}</p>
        <input
          type="password"
          placeholder="Password"
          className={errors.password ? "user-login-input-error" : "user-login-input"}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        />
        <p className="user-login-error-message">{errors.password?.message}</p>
        <a href="/forgotPassword" className="user-login-forgot-password">Forgot Password?</a>
        <button type="submit" className="user-login-button">Log In</button>
      </form>
      <DevTool control={control} />
      <GoogleLogin onSuccess={handleSuccess} onError={() => console.log("Login Failed")} />
      <p>
        Don't have an account? <a href="/signup" className="user-login-signup-link">Sign up</a>
      </p>
    </div>
    <div className="user-login-left-background"></div>
    <div className="user-login-right-background">
      <img className="user-login-bg-image" src={bgImage} alt="Background" />
    </div>
  </div>
  
     )}
    </>
  );
}

export default UserLogin;
