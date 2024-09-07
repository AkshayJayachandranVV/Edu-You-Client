import React, { useState,useEffect } from 'react';
import './TutorSignup.css';
import { useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import bgImage from '../../../../assets/images/TutorReminiLogin.jpg';
import signupIcon from '../../../../assets/icons/signup.png';
import Spinner from '../../../Spinner/Spinner';
import { tutorEndpoints } from '../../../constraints/endpoints/TutorEndpoints';

type formValues = {
  tutorname: string;
  email: string;
  password: string;
  confirmPassword: string;
};

function TutorSignup() {
  const form = useForm<formValues>();
  const [isLoading, setLoading] = useState(false);
  const { register, control, handleSubmit, formState, setError } = form;
  const { errors } = formState;
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('tutorAccessToken');
    if (token) {
      navigate("/tutor/dashboard");
    }
  }, [navigate]);

  const onSubmit = async (data: formValues) => {
    try {
      console.log(data, " got the datac in onSubmit");
      setLoading(true);
      const { confirmPassword, ...tutorDataWithoutConfirmPassword } = data;
      console.log(confirmPassword);
      

      const result = await axios.post(tutorEndpoints.register, tutorDataWithoutConfirmPassword);

      if (result.data.success) {
        console.log(result)
        setLoading(false);
        localStorage.removeItem("tutorOtpTimer")
        localStorage.setItem('tutor-id', result.data.tempId);
        localStorage.setItem('email', result.data.email);
        navigate('/tutor/otp');
      } else {
        setLoading(false);
        setError('email', {
          type: 'manual',
          message: 'Email already exists',
        });
      }
    } catch (error) {
      console.log("catch error in onsubmit", error);
      setLoading(false);
      setError('email', {
        type: 'manual',
        message: 'Network error, please try again later',
      });
    }
  };

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="tutor-signup-full-background">
          <div className="tutor-signup-input-part">
            <div className="tutor-signup-input-head">
              <img className="tutor-signup-icon" src={signupIcon} alt="Signup Icon" />
              <div className="tutor-signup-input-header">
                <h1>Registration</h1>
                <p>Please Sign up to access your account</p>
              </div>
            </div>
            <form
              className="tutor-signup-form-container"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <input
                type="text"
                placeholder="Username"
                className={errors.tutorname ? 'tutor-input-with-error' : ''}
                {...register('tutorname', {
                  required: 'tutorname is required',
                  minLength: {
                    value: 3,
                    message: 'Username must be at least 3 characters',
                  },
                })}
              />
              <p className="tutor-signup-error-message">{errors.tutorname?.message}</p>

              <input
                type="email"
                placeholder="Email"
                className={errors.email ? 'tutor-input-with-error' : ''}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Please enter a valid email address',
                  },
                })}
              />
              <p className="tutor-signup-error-message">{errors.email?.message}</p>

              <input
                type="password"
                placeholder="Password"
                className={errors.password ? 'tutor-input-with-error' : ''}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
              <p className="tutor-signup-error-message">{errors.password?.message}</p>

              <input
                type="password"
                placeholder="Confirm Password"
                className={errors.confirmPassword ? 'tutor-input-with-error' : ''}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === form.watch('password') || 'Passwords do not match',
                })}
              />
              <p className="tutor-signup-error-message">{errors.confirmPassword?.message}</p>

              <a href="#" className="tutor-signup-forgot-link">
                Forgot Password?
              </a>
              <button type="submit">Sign Up</button>
            </form>
            <DevTool control={control} />
            <p>
              Already have an account? <a href="/login">Log in</a>
            </p>
          </div>
          <div className="tutor-signup-left-background"></div>
          <div className="tutor-signup-right-background">
            <img className="tutor-signup-image-background" src={bgImage} alt="Background" />
          </div>
        </div>
      )}
    </>
  );
}

export default TutorSignup;
