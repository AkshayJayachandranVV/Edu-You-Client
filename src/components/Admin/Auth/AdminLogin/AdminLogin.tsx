import React, { useState, useEffect } from "react";
import "./AdminLogin.css";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useNavigate } from "react-router-dom";
import adminIcon from "../../../../assets/icons/User/administrator.png";
import AdminImage from "../../../../assets/images/Admin/—Pngtree—information technology vector_12148048.png";
import Spinner from '../../../Spinner/Spinner';
import Cookies from 'js-cookie';
import { adminEndpoints } from '../../../constraints/endpoints/adminEndpoints';
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

  useEffect(() => {
    const token = localStorage.getItem('adminAccessToken');
    if (token) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const onSubmit = async (data: formValues) => {
    try {
      setLoading(true);
      const result = await axios.post(adminEndpoints.login, data);

      if (result.data.success) {
        localStorage.setItem('adminAccessToken', result.data.adminAccessToken);
        Cookies.set('tutorAccessToken', result.data.adminAccessToken, { expires: 7 });
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
      console.log(error)
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
        <div className="admin-full-background">
          <div className="admin-left-background">
            <div className="admin-left-header">
              <h1>Technology Alone <br /> Is Not Enough</h1>
            </div>
            <div className="admin-left-image">
              <img className="admin-login-image" src={AdminImage} alt="Technology" />
            </div>
          </div>
          <div className="admin-right-background">
            <div className="admin-input-container">
              <img className="admin-login-icon" src={adminIcon} alt="Lock Icon" />
              <h1 className="admin-login-heading">Admin Login</h1>
              <p>Nice to see you! Please login with your account</p>
            </div>
            <form
              className="admin-form-container"
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
              />
              <p className="login-error-message">{errors.email?.message}</p>

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
              />
              <p className="login-error-message">{errors.password?.message}</p>

              <button type="submit">Login</button>
            </form>
            <DevTool control={control} />
          </div>
        </div>
      )}
    </>
  );
}

export default AdminLogin;
