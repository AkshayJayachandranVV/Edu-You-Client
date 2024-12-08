import { useState,useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import bgImage from '@/assets/images/TutorReminiLogin.jpg';
import loginIcon from '@/assets/icons/loginLock.png';
import Spinner from '../../../Spinner/Spinner';
import { tutorEndpoints } from '../../../constraints/endpoints/TutorEndpoints'; // Update with actual endpoint
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import {useDispatch} from 'react-redux'
import {setTutor} from '../../../../redux/tutorSlice'

type formValues = {
  email: string;
  password: string;
};

interface DecodedToken {
  email: string;
  name: string;
}

function TutorLogin() {
  const form = useForm<formValues>();
  const { register, control, handleSubmit, formState, setError } = form;
  const { errors } = formState;
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch()
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    console.log(credentialResponse);
  
    if (credentialResponse.credential) {
      // Decode the JWT token
      const decoded: DecodedToken = jwtDecode<DecodedToken>(credentialResponse.credential);
      console.log(decoded);
  
      const tutorData = {
        email: decoded.email,
        fullname: decoded.name,
      };
  
      console.log(tutorData, "tutorData");
  
      try {
        // Send the extracted data to your backend
        const result = await axios.post(tutorEndpoints.googleLogin, tutorData);
        console.log(result.data)
  
        if (result.data.success) {
          console.log("Successfully logged in using GOOGLE");

          console.log(result.data.tutor_data);
          const { id, tutorname, email, phone } = result.data.tutor_data;
          console.log("every data", id, tutorname, email, phone);
  
          // Dispatch the user data to the Redux store
          dispatch(setTutor({ id: id, tutorname, email, phone }));
          console.log("Successfully logged in using GOOGLE");

          localStorage.setItem('tutorAccessToken', result.data.tutorAccessToken);
          localStorage.setItem('tutorId',id);
          Cookies.set('tutorAccessToken', result.data.tutorAccessToken, { expires: 1 });    
          Cookies.set('tutorRefreshToken', result.data.tutorRefreshToken, { expires: 7 }); 
          navigate('/tutor/dashboard');
        } else if (result.data.message === "User is Blocked") {
          alert("You are blocked. Please contact support.");
          console.log("Tutor is blocked");
        } else {
          console.log("Google login failed:", result.data.message);
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
      console.log('form submitted', data);
  
      const result = await axios.post(tutorEndpoints.login, data); // Use the correct endpoint
  
      console.log(result);
  
      if (result.data.success) {
          
        console.log(result.data.tutorData);
        const { id, tutorname, email, phone } = result.data.tutorData;
        console.log("every data", id, tutorname, email, phone);

        // Dispatch the user data to the Redux store
        dispatch(setTutor({ id: id, tutorname, email, phone }));

        localStorage.setItem('tutorAccessToken', result.data.tutorAccessToken);
        localStorage.setItem('tutorId',id);
        Cookies.set('tutorAccessToken', result.data.tutorAccessToken, { expires: 1 });    
        Cookies.set('tutorRefreshToken', result.data.tutorRefreshToken, { expires: 7 });  
        setLoading(false);
        navigate('/tutor/dashboard'); // Redirect after successful login
      } else {
        setLoading(false);
  
        // Handle different error messages from the backend
        if (result.data.message === 'Email incorrect') {
          setError('email', {
            type: 'manual',
            message: 'Incorrect Email',
          });
        } else if (result.data.message === 'Incorrect Password') {
          setError('password', {
            type: 'manual',
            message: 'Incorrect Password',
          });
        } else if (result.data.message === "User is Blocked") {
          // Handle blocked tutor
          setError("email", {
            type: "manual",
            message: "You are blocked. Please contact support.",
          });
        }
      }
      console.log('got the result', result);
    } catch (error) {
      setLoading(false);
      setError('email', {
        type: 'manual',
        message: 'Network error, please try again later',
      });
      console.log('error while on submit', error);
    }
  };
  

  return (
    <>
    {isLoading ? (
      <Spinner />
    ) : (
      <div
        className={`flex justify-center items-center min-h-screen relative ${
          isMobile ? "bg-cover bg-center" : "bg-[#f0f4f8]"
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
              : "top-[8vh] left-[10vw] min-h-[95vh] w-[41vw] bg-white"
          } z-20 flex flex-col items-center justify-start py-8`}
        >
          <div className="flex flex-col items-center mb-8">
            <img className="w-16 h-16 mb-4" src={loginIcon} alt="Lock Icon" />
            <div className="text-center">
              <h1 className="text-xl">LOGIN</h1>
              <p className="text-base">Please log in to access your account</p>
            </div>
          </div>
  
          <form
            className="w-4/5 flex flex-col items-center"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <input
              type="email"
              placeholder="Email"
              className={`w-full py-3 mb-2 rounded border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } text-base ${isMobile ? "bg-white bg-opacity-50" : "bg-white"}`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Please enter a valid email address",
                },
              })}
            />
            <p className="text-red-500 text-sm mb-2">{errors.email?.message}</p>
  
            <input
              type="password"
              placeholder="Password"
              className={`w-full py-3 mb-2 rounded border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } text-base ${isMobile ? "bg-white bg-opacity-50" : "bg-white"}`}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            <p className="text-red-500 text-sm mb-2">{errors.password?.message}</p>
  
            <a href="/tutor/forgotPassword" className="self-end text-[#1ecae1] text-sm mb-2">
              Forgot Password?
            </a>
  
            <button
              type="submit"
              className="w-full py-3 rounded bg-[#1ecae1] text-white font-medium hover:bg-[#17b2cc] mb-4"
            >
              Log In
            </button>
          </form>
  
          <DevTool control={control} />
  
          <div className="mb-4">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => console.log("Login Failed")}
            />
          </div>
  
          <p>
            Don't have an account? <a href="/tutor/signup" className="text-[#1ecae1]">Sign up</a>
          </p>
        </div>
      </div>
    )}
  </>
  
  
  );
}

export default TutorLogin;
