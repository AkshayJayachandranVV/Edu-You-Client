import  { useState } from 'react';
import { useForm } from 'react-hook-form';
import './TutorForgotPass.css';
import bgImage from '../../../../assets/images/TutorReminiLogin.jpg';
import forgotIcon from '../../../../assets/icons/forgot-password.png';
import { tutorEndpoints } from '../../../constraints/endpoints/TutorEndpoints'; // Update with the correct path
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../../../Spinner/Spinner'; // Import your Spinner component

type FormValues = {
  email: string;
};

function TutorForgotPass() {
  const { register, handleSubmit, formState: { errors }, setError } = useForm<FormValues>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // State to manage loading



  const onSubmit = async (data: FormValues) => {
    setIsLoading(true); // Start loading
    try {
      console.log('Entered tutor forgot password');
      console.log('Submitted data:', data);

      const result = await axios.post(tutorEndpoints.forgotPasword, data);
      console.log(result, 'Tutor forgot password response');

      if (result.data.success) {
        localStorage.removeItem('otpTimer');
        console.log('Tutor forgot password success');

        if (result.data.forgotPass === true) {
          localStorage.setItem('tutor-forgotPass', JSON.stringify(result.data.forgotPass));
          localStorage.setItem('tutor-id', result.data.tempId);
        }

        navigate('/tutor/otp');
      } else {
        setError('email', {
          type: 'manual',
          message: 'Tutor not found',
        });
      }
    } catch (error) {
      console.log('Error in tutor forgot password submission:', error);
      setError('email', {
        type: 'manual',
        message: 'An error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <>
      {isLoading ? (
        <Spinner /> // Show spinner while loading
      ) : (
        <div className='tutor-full-background'>
          <div className='tutor-input-part'>
            <div className='tutor-input-Head'>
              <img className='tutor-icon' src={forgotIcon} alt='Lock Icon' />
              <div className='tutor-input-Header'>
                <h1>Forgot Password</h1>
                <p>Please enter your email</p>
              </div>
            </div>
            <form className='tutor-form-container' onSubmit={handleSubmit(onSubmit)}>
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
                className={errors.email ? 'tutor-input-with-error' : ''}
              />
              <p className='tutor-error-message'>{errors.email?.message}</p>
              <button type='submit'>Submit</button>
            </form>
            <p>Already have an account? <a href="#">Log in</a></p>
          </div>
          <div className='tutor-left-background'></div>
          <div className='tutor-right-background'>
            <img className='tutor-image-background' src={bgImage} alt='Background' />
          </div>
        </div>
      )}
    </>
  );
}

export default TutorForgotPass;
