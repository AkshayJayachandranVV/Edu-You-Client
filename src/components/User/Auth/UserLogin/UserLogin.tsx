import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useNavigate } from "react-router-dom";
import bgImage from "../../../../assets/images/UserLogin-Background.jpg";
import loginIcon from "../../../../assets/icons/User/UserLoginLock.png";
import Spinner from "../../../Spinner/Spinner";
import { userEndpoints } from "../../../constraints/endpoints/userEndpoints";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser, setCoursesEnrolled } from "../../../../redux/userSlice";
import socketService from "../../../../socket/socketService";

type formValues = {
  email: string;
  password: string;
};

function UserLogin() {
  const form = useForm<formValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit", // Options: onChange, onBlur, or all
  });
  const { register, control, handleSubmit, formState, setError } = form;
  const { errors } = formState;
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false); 
  const dispatch = useDispatch();

  interface DecodedToken {
    email: string;
    name: string;
  }

 
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      try {
        const decoded: DecodedToken = jwtDecode<DecodedToken>(
          credentialResponse.credential
        );

        const userData = { email: decoded.email, fullname: decoded.name };

        const result = await axios.post(userEndpoints.googleLogin, userData);

        if (result.data.success) {
          const { id, username, email, phone, myCourse } =
            result.data.user_data;
          const courseIds = myCourse.map(
            (course: { courseId: string }) => course.courseId
          );

          dispatch(setUser({ id, username, email, phone }));
          dispatch(setCoursesEnrolled(courseIds));

          localStorage.setItem("userId", id);
          localStorage.setItem("userAccessToken", result.data.userAccessToken);
          Cookies.set("userAccessToken", result.data.userAccessToken, {
            expires: 1,
          });
          Cookies.set("userRefreshToken", result.data.userRefreshToken, {
            expires: 7,
          });

          navigate("/home");
          socketService.connect();
        } else if (result.data.message === "User is Blocked") {
          alert("You are blocked. Please contact support.");
        }
      } catch (error) {
        console.error("Error during Google login:", error);
      }
    } else {
      console.error("Credential response does not contain a valid JWT token");
    }
  };

  const onSubmit = async (data: formValues) => {
    try {
      setLoading(true);
      const result = await axios.post(userEndpoints.login, data);

      if (result.data.success) {
        const { id, username, email, phone, myCourse } = result.data.userData;
        const courseIds = myCourse.map(
          (course: { courseId: string }) => course.courseId
        );

        dispatch(setUser({ id, username, email, phone }));
        dispatch(setCoursesEnrolled(courseIds));

        localStorage.setItem("userId", id);
        localStorage.setItem("userAccessToken", result.data.userAccessToken);
        Cookies.set("userAccessToken", result.data.userAccessToken, {
          expires: 1,
        });
        Cookies.set("userRefreshToken", result.data.userRefreshToken, {
          expires: 7,
        });

        setLoading(false);
        navigate("/home");
        socketService.connect();
      } else {
        setLoading(false);

        if (result.data.message === "Email incorrect") {
          setError("email", { type: "manual", message: "Incorrect Email" });
        } else if (result.data.message === "Incorrect Password") {
          setError("password", {
            type: "manual",
            message: "Incorrect Password",
          });
        } else if (result.data.message === "User is Blocked") {
          setError("email", {
            type: "manual",
            message: "You are blocked. Please contact support.",
          });
        }
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError("email", {
        type: "manual",
        message: "Network error, please try again later",
      });
    }
  };

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div
          className={`h-[120vh] w-full flex justify-center items-center ${
            isMobile ? "bg-cover bg-center" : "bg-gray-100"
          } relative`}
          style={isMobile ? { backgroundImage: `url(${bgImage})` } : {}}
        >
          {/* Desktop background */}
          {!isMobile && (
            <>
              <div className="hidden lg:block fixed top-0 left-0 h-screen w-[70vw] bg-[#232536] z-10"></div>
              <div className="hidden lg:block fixed top-0 right-0 h-[120vh] w-[56vw] bg-white z-10">
                <img
                  className="absolute top-0 right-0 h-screen w-[67vw] object-cover"
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
                : "top-[8vh] left-[10vw] h-[95vh] w-[41vw] bg-white"
            } z-20 flex flex-col items-center justify-start pt-8 rounded-lg shadow-lg`}
          >
            <div className="flex flex-col items-center mb-8">
              <img
                className={`w-16 h-16 mb-4 ${isMobile ? "opacity-80" : ""}`}
                src={loginIcon}
                alt="Lock Icon"
              />
              <div>
                <h1
                  className={`text-lg text-center ${
                    isMobile ? "text-white/90" : "text-black"
                  }`}
                >
                  LOGIN
                </h1>
                <p
                  className={`text-sm text-center ${
                    isMobile ? "text-white/70" : "text-black"
                  }`}
                >
                  Please log in to access your account
                </p>
              </div>
            </div>
            <form
              className="w-[80%] flex flex-col items-center"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              {/* Email Input */}
              <input
                type="email"
                placeholder="Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Enter a valid email address",
                  },
                })}
                className={`w-full p-3 mb-2 rounded border ${
                  isMobile
                    ? "bg-transparent text-white placeholder-white border-2 border-white"
                    : "bg-gray-50 text-black placeholder-gray-500 border-gray-400"
                } focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base`}
              />
              <p className="text-red-500 text-sm w-full mt-1 mb-1 text-left">
                {errors.email?.message}
              </p>

              {/* Password Input */}
              <input
                type="password"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long",
                  },
                })}
                className={`w-full p-3 mb-2 rounded border ${
                  isMobile
                    ? "bg-transparent text-white placeholder-white border-2 border-white"
                    : "bg-gray-50 text-black placeholder-gray-500 border-gray-400"
                } focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base`}
              />
              <p className="text-red-500 text-sm w-full mt-1 mb-1 text-left">
                {errors.password?.message}
              </p>

              {/* Forgot Password Link */}
              <a
                href="/forgotPassword"
                className={`self-end mb-2 text-sm ${
                  isMobile ? "text-[#384d60]" : "text-black"
                } hover:underline`}
              >
                Forgot Password?
              </a>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full p-3 rounded bg-[#232536] text-white text-base mb-4 hover:bg-[#17b2cc]"
              >
                Log In
              </button>
            </form>

            <DevTool control={control} />
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => console.log("Login Failed")}
            />
            <p
              className={`text-sm mt-4 ${
                isMobile ? "text-[#232536]" : "text-black"
              }`}
            >
              Don't have an account?{" "}
              <a href="/signup" className="text-[#17b2cc] hover:text-[#17b2cc]">
                Sign up
              </a>
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default UserLogin;
