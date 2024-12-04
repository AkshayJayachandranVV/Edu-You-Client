import  { useState,useEffect} from 'react';
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
  const [isMobile, setIsMobile] = useState(false);
  const { errors } = formState;
  const navigate = useNavigate();


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


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
      <div
        className={`flex justify-center items-center min-h-screen relative ${
          isMobile ? "bg-cover bg-center" : "bg-gray-100"
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
              : "top-[5vh] left-[10vw] min-h-[90vh] w-[40vw] bg-white"
          } z-20 flex flex-col items-center justify-start py-8`}
        >
          <div className="flex flex-col items-center mb-8">
            <img
              className="w-14 h-14 mb-4"
              src={signupIcon}
              alt="Signup Icon"
            />
            <div className="text-center">
              <h1 className="text-xl font-bold">Registration</h1>
              <p>Please Sign up to access your account</p>
            </div>
          </div>
  
          <form
            className="w-4/5 flex flex-col items-center"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <input
              type="text"
              placeholder="Username"
              className={`w-full py-3 mb-2 rounded border ${
                errors.tutorname ? 'border-red-500' : 'border-gray-300'
              } text-base ${
                isMobile ? 'bg-white bg-opacity-50' : 'bg-white opacity-100'
              }`}
              {...register('tutorname', {
                required: 'Tutorname is required',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters',
                },
              })}
            />
            <p className="text-red-500 text-sm mb-2">{errors.tutorname?.message}</p>
  
            <input
              type="email"
              placeholder="Email"
              className={`w-full py-3 mb-2 rounded border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } text-base ${
                isMobile ? 'bg-white bg-opacity-50' : 'bg-white opacity-100'
              }`}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'Please enter a valid email address',
                },
              })}
            />
            <p className="text-red-500 text-sm mb-2">{errors.email?.message}</p>
  
            <input
              type="password"
              placeholder="Password"
              className={`w-full py-3 mb-2 rounded border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } text-base ${
                isMobile ? 'bg-white bg-opacity-50' : 'bg-white opacity-100'
              }`}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
            <p className="text-red-500 text-sm mb-2">{errors.password?.message}</p>
  
            <input
              type="password"
              placeholder="Confirm Password"
              className={`w-full py-3 mb-2 rounded border ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              } text-base ${
                isMobile ? 'bg-white bg-opacity-50' : 'bg-white opacity-100'
              }`}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === form.watch('password') || 'Passwords do not match',
              })}
            />
            <p className="text-red-500 text-sm mb-2">{errors.confirmPassword?.message}</p>
  
            <a href="#" className="self-end text-blue-600 text-sm mb-6">
              Forgot Password?
            </a>
  
            <button
              type="submit"
              className="w-full py-3 rounded bg-[#1ecae1] text-white font-medium hover:bg-[#17b2cc]"
            >
              Sign Up
            </button>
          </form>
  
          <DevTool control={control} />
  
          <p className="mt-4">
            Already have an account?{' '}
            <a href="/tutor/login" className="text-blue-600">
              Log in
            </a>
          </p>
        </div>
      </div>
    )}
  </>
  

  );
}

export default TutorSignup;
