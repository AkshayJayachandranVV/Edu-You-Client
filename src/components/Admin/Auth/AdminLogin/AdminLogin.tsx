import { useState } from "react";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useNavigate } from "react-router-dom";
import adminIcon from "../../../../assets/icons/User/administrator.png";
import AdminImage from "../../../../assets/images/Admin/—Pngtree—information technology vector_12148048.png";
import Spinner from "../../../Spinner/Spinner";
import Cookies from "js-cookie";
import { adminEndpoints } from "../../../constraints/endpoints/adminEndpoints";
import axios from "axios";

type formValues = {
  email: string;
  password: string;
};

function AdminLogin() {
  const form = useForm<formValues>();
  const { register, control, handleSubmit, formState, setError } = form;
  const { errors } = formState;
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);

  const onSubmit = async (data: formValues) => {
    try {
      setLoading(true);
      const result = await axios.post(adminEndpoints.login, data);

      if (result.data.success) {
        localStorage.setItem("adminAccessToken", result.data.adminAccessToken);
        Cookies.set("adminAccessToken", result.data.adminAccessToken, {
          expires: 1,
        });
        Cookies.set("adminRefreshToken", result.data.adminRefreshToken, {
          expires: 7,
        });
        setLoading(false);
        navigate("/admin/dashboard");
      } else {
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
        <div className="flex flex-col md:flex-row h-screen bg-gray-100 overflow-hidden">
          {/* Left Section */}
          <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-black text-white p-6 sm:p-8 h-full">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center leading-tight">
              Technology Alone <br /> Is Not Enough
            </h1>
            <div className="flex justify-center items-center mt-6 sm:mt-8 w-full max-h-[50%]">
              <img
                className="max-w-[80%] sm:max-w-[70%] lg:max-w-[60%] object-contain"
                src={AdminImage}
                alt="Technology"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white p-6 sm:p-8 h-full">
            <div className="text-center mb-8">
              <img
                className="w-12 h-12 sm:w-16 sm:h-16 mb-4"
                src={adminIcon}
                alt="Admin Icon"
              />
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
                Admin Login
              </h1>
              <p className="text-gray-500 text-sm sm:text-base">
                Nice to see you! Please login with your account
              </p>
            </div>
            <form
              className="w-full max-w-xs sm:max-w-sm flex flex-col"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <input
                type="email"
                placeholder="Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Please enter a valid email address",
                  },
                })}
                className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring focus:ring-blue-200 text-sm sm:text-base"
              />
              <p className="text-red-500 text-xs sm:text-sm mb-4">
                {errors.email?.message}
              </p>

              <input
                type="password"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring focus:ring-blue-200 text-sm sm:text-base"
              />
              <p className="text-red-500 text-xs sm:text-sm mb-4">
                {errors.password?.message}
              </p>

              <button
                type="submit"
                className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition text-sm sm:text-base"
              >
                Login
              </button>
            </form>
            <DevTool control={control} />
          </div>
        </div>
      )}
    </>
  );
}

export default AdminLogin;
