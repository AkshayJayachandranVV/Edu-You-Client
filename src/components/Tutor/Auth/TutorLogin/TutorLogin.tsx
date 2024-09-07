import React, { useState, useEffect } from 'react';
import './TutorLogin.css';
import { useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import bgImage from '../../../../assets/images/TutorReminiLogin.jpg';
import loginIcon from '../../../../assets/icons/loginLock.png';
// import googleIcon from '../../../../assets/icons/google.png';
import Spinner from '../../../Spinner/Spinner';
import { tutorEndpoints } from '../../../constraints/endpoints/TutorEndpoints'; // Update with actual endpoint
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

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

  useEffect(() => {
    const token = localStorage.getItem('tutorAccessToken');
    if (token) {
      navigate("/tutor/dashboard");
    }
  }, [navigate]);

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

        if (result.data.success) {
          console.log("Successfully logged in using GOOGLE");
          localStorage.setItem('tutorAccessToken', result.data.tutorAccessToken);
          navigate('/tutor/dashboard');
        } else {
          console.log(result);
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
      setLoading(true);
      console.log('form submitted', data);

      const result = await axios.post(tutorEndpoints.login, data); // Use the correct endpoint

      console.log(result);

      if (result.data.success) {
        localStorage.setItem('tutorAccessToken', result.data.tutorAccessToken);
        setLoading(false);
        navigate('/tutor/dashboard'); // Redirect after successful login
      } else {
        if (result.data.message === 'Email incorrect') {
          setLoading(false);
          setError('email', {
            type: 'manual',
            message: 'Incorrect Email',
          });
        } else if (result.data.message === 'Incorrect Password') {
          setLoading(false);
          setError('password', {
            type: 'manual',
            message: 'Incorrect Password',
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
        <div className='tutorlogin-full-background'>
          <div className='tutorlogin-input-part'>
            <div className='tutorlogin-input-head'>
              <img className='tutorlogin-icon' src={loginIcon} alt='Lock Icon' />
              <div className='tutorlogin-input-header'>
                <h1>LOGIN</h1>
                <p>Please log in to access your account</p>
              </div>
            </div>
            <form
              className='tutorlogin-form-container'
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <input
                type='email'
                placeholder='Email'
                className={errors.email ? 'tutorlogin-input-with-error' : ''}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Please enter a valid email address',
                  },
                })}
              />
              <p className='tutor-login-error-message'>{errors.email?.message}</p>
              <input
                type='password'
                placeholder='Password'
                className={errors.password ? 'tutorlogin-input-with-error' : ''}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
              <p className='tutor-login-error-message'>{errors.password?.message}</p>
              <a href='/tutor/forgotPassword' className='tutorlogin-forgot-link'>
                Forgot Password?
              </a>
              <button type='submit'>Log In</button>
            </form>
            <DevTool control={control} />
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => console.log("Login Failed")}
            />
            <p>
              Don't have an account? <a href='/tutor/signup'>Sign up</a>
            </p>
          </div>
          <div className='tutorlogin-left-background'></div>
          <div className='tutorlogin-right-background'>
            <img className='tutorlogin-image-background' src={bgImage} alt='Background' />
          </div>
        </div>
      )}
    </>
  );
}

export default TutorLogin;
