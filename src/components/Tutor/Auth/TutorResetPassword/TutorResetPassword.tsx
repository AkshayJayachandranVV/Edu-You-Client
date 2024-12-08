import  { useState,useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import resetIcon from '@/assets/icons/User/OtpIcon.png'; // Update with your icon path
import bgImage from '@/assets/images/TutorReminiLogin.jpg';
import Spinner from '../../../Spinner/Spinner';
import { tutorEndpoints } from '../../../constraints/endpoints/TutorEndpoints'; // Update with actual endpoint

type formValues = {
  newPassword: string;
  confirmPassword: string;
};

function ResetPassword() {
  const form = useForm<formValues>();
  const { register, control, handleSubmit, formState, setError } = form;
  const [isMobile, setIsMobile] = useState(false);
  const { errors } = formState;
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


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
    <div
      className={`min-h-screen w-full flex justify-center items-center bg-gray-100 relative ${
        isMobile ? "bg-cover bg-center" : "bg-gray-100"
      }`}
      style={isMobile ? { backgroundImage: `url(${bgImage})` } : {}}
    >
      {/* Desktop background */}
      {!isMobile && (
        <>
          <div className="fixed top-0 left-0 h-screen w-[70vw] bg-[#1ecae1] z-10"></div>
          <div className="fixed top-0 right-0 h-[120vh] w-[56vw] bg-white z-10">
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
            : "top-[8vh] left-[10vw] w-[41vw] bg-white"
        } z-20 flex flex-col items-center justify-start pt-8`}
      >
        <div className="flex flex-col items-center mb-8">
          <img className="w-16 h-16 mb-4" src={resetIcon} alt="Reset Icon" />
          <div className="text-center">
            <h1 className="text-xl font-bold">RESET PASSWORD</h1>
            <p className="text-base">Please enter your new password</p>
          </div>
        </div>

        <form
          className="w-4/5 flex flex-col items-center"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <input
            type="password"
            placeholder="New Password"
            className={`w-full py-3 mb-4 rounded border ${
              errors.newPassword ? 'border-red-500' : 'border-gray-300'
            } text-base ${
              isMobile ? 'bg-white bg-opacity-50' : 'bg-white opacity-100'
            }`}
            {...register('newPassword', {
              required: 'New Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
          />
          <p className="text-red-500 text-sm mb-2">{errors.newPassword?.message}</p>

          <input
            type="password"
            placeholder="Confirm Password"
            className={`w-full py-3 mb-4 rounded border ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            } text-base ${
              isMobile ? 'bg-white bg-opacity-50' : 'bg-white opacity-100'
            }`}
            {...register('confirmPassword', {
              required: 'Confirm Password is required',
            })}
          />
          <p className="text-red-500 text-sm mb-2">{errors.confirmPassword?.message}</p>

          <button
            type="submit"
            className="w-full py-3 rounded bg-[#1ecae1] text-white font-medium hover:bg-[#17b2cc] mb-4"
          >
            Reset Password
          </button>
        </form>

        <DevTool control={control} />

        <p className="mt-4 text-center">
          Already have an account?{' '}
          <a href="/tutor/login" className="text-blue-600">
            Log in
          </a>
        </p>
      </div>

      {/* Right background image */}
      <div className="absolute top-0 right-0 h-[120vh] w-[56vw] z-10">
        <img className="h-full w-full object-cover" src={bgImage} alt="Background" />
      </div>
    </div>
  )}
</>

  
  );
}

export default ResetPassword;
