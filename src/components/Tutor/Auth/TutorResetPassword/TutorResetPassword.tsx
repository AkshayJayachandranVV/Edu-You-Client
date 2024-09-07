import React, { useState,useEffect } from 'react';
import './TutorResetPassword.css';
import { useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import resetIcon from '../../../../assets/icons/User/OtpIcon.png'; // Update with your icon path
import bgImage from '../../../../assets/images/TutorReminiLogin.jpg';
import Spinner from '../../../Spinner/Spinner';
import { tutorEndpoints } from '../../../constraints/endpoints/TutorEndpoints'; // Update with actual endpoint

type formValues = {
  newPassword: string;
  confirmPassword: string;
};

function ResetPassword() {
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

  const onSubmit = async (data: formValues) => {
    if (data.newPassword !== data.confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match',
      });
      return;
    }
    try {
      setLoading(true);
      console.log('form submitted', data);
      const email = localStorage.getItem('email') 

      const result = await axios.post(tutorEndpoints.resetPassword, {
        newPassword: data.newPassword,
        email : email
      });

      console.log(result);

      if (result.data.success) {
        setLoading(false);
        navigate('/tutor/login'); // Redirect after successful password reset
      } else {
        setLoading(false);
        setError('newPassword', {
          type: 'manual',
          message: 'Password reset failed, please try again',
        });
      }
      console.log('got the result', result);
    } catch (error) {
      setLoading(false);
      setError('newPassword', {
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
        <div className='reset-password-full-background'>
          <div className='reset-password-input-part'>
            <div className='reset-password-input-head'>
              <img className='reset-password-icon' src={resetIcon} alt='Reset Icon' />
              <div className='reset-password-input-header'>
                <h1>RESET PASSWORD</h1>
                <p>Please enter your new password</p>
              </div>
            </div>
            <form
              className='reset-password-form-container'
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <input
                type='password'
                placeholder='New Password'
                className={errors.newPassword ? 'reset-password-input-with-error' : ''}
                {...register('newPassword', {
                  required: 'New Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
              <p className='reset-password-error-message'>{errors.newPassword?.message}</p>
              <input
                type='password'
                placeholder='Confirm Password'
                className={errors.confirmPassword ? 'reset-password-input-with-error' : ''}
                {...register('confirmPassword', {
                  required: 'Confirm Password is required',
                })}
              />
              <p className='reset-password-error-message'>{errors.confirmPassword?.message}</p>
              <button type='submit'>Reset Password</button>
            </form>
            <DevTool control={control} />
            <p>
              Already have an account? <a href="">Log in</a>
            </p>
          </div>
          <div className='reset-password-left-background'></div>
          <div className='reset-password-right-background'>
          <img className='tutorotp-image-background' src={bgImage} alt="Background" />
          </div>
        </div>
      )}
    </>
  );
}

export default ResetPassword;
