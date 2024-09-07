import React, {useState,useEffect} from "react";
import "./UserLogin.css";
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

  interface DecodedToken {
    // Define the structure of your decoded token here
    email: string;
    name: string;
    // Add other fields based on your token structure
  }

  useEffect(() => {
    const token = localStorage.getItem('userAccessToken');
    if (token) {
      navigate("/");
    }
  }, [navigate]);


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

        console.log(userData,"userdata")

        try {
            // Send the extracted data to your backend
            const result = await axios.post(userEndpoints.googleLogin, userData);

            if (result.data.success) {
                console.log("succesfully logged in uding GOOGLE")
                localStorage.setItem('userAccessToken', result.data.userAccessToken);
                navigate('/');
            } else {
                console.log(result)
            }
        } catch (error) {
            console.error(error);
        }
    } else {
        console.error('Credential response does not contain a valid JWT token');
    }
};





  const onSubmit = async (data: formValues) => {
    try {
      setLoading(true)
      console.log("form submitted", data);

      const result = await axios.post(userEndpoints.login, data);

      console.log(result)

      if (result.data.success) {
        localStorage.setItem('userAccessToken', result.data.userAccessToken);
        setLoading(false)
        navigate("/");
      } else {
          if (result.data.message == "Email incorrect") {
            setLoading(false)
            setError("email", {
              type: "manual",
              message: "Incorrect Email",
            });

          } else if (result.data.message == "Incorrect Password") {  
            setLoading(false)   
            setError("password", {
              type: "manual",
              message: "Incorrect Password",
            });

          }
      }
      console.log("got the result ", result);
    } catch (error) {
      setLoading(false)
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
    <div className="login-container">
      <div className="login-content">
        <div className="login-header">
          <img className="login-icon" src={loginIcon} alt="Lock Icon" />
          <div className="login-title">
            <h1>LOGIN</h1>
            <p>Please log in to access your account</p>
          </div>
        </div>
        <form
          className="login-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <input
            type="email"
            placeholder="Email"
            className={errors.email ? "login-input-with-error" : ""}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Please enter a valid email address",
              },
            })}
          />
          <p className="login-error-message">{errors.email?.message}</p>
          <input
            type="password"
            placeholder="Password"
            className={errors.password ? "login-input-with-error" : ""}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          <p className="login-error-message">{errors.password?.message}</p>
          <a href="/forgotPassword" className="forgot-password">
            Forgot Password?
          </a>
          <button type="submit">Log In</button>
        </form>
        <DevTool control={control} />
        <GoogleLogin
            onSuccess={handleSuccess}
              onError={() => console.log("Login Failed")}
        />
        <p>
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
      <div className="login-left-background"></div>
      <div className="login-right-background">
        <img className="login-bg-image" src={bgImage} alt="Background" />
      </div>
    </div>
     )}
    </>
  );
}

export default UserLogin;
