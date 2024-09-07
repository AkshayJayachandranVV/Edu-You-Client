import React, { useState, useEffect } from "react";
import "./ResetPassword.css";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useNavigate } from "react-router-dom";
import bgImage from "../../../../assets/images/UserLogin-Background.jpg";
import resetIcon from "../../../../assets/icons/User/UserLoginLock.png";
import Spinner from '../../../Spinner/Spinner';
import { userEndpoints } from '../../../constraints/endpoints/userEndpoints';
import axios from "axios";

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
    const token = localStorage.getItem('userAccessToken');
    if (token) {
      navigate("/");
    }
  }, [navigate]);


  const onSubmit = async (data: formValues) => {
    if (data.newPassword !== data.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }

    try {
      setLoading(true);
      console.log("form submitted", data);
      const email = localStorage.getItem('email') 

      const result = await axios.post(userEndpoints.resetPassword, {
        newPassword: data.newPassword,
        email : email
      });

      console.log(result);

      if (result.data.success) {
        setLoading(false);
        navigate("/login");
      } else {
        setLoading(false);
        setError("newPassword", {
          type: "manual",
          message: "Password reset failed",
        });
      }
    } catch (error) {
      setLoading(false);
      setError("newPassword", {
        type: "manual",
        message: "Network error, please try again later",
      });
      console.log("error while on submit", error);
    }
  };

  return (
    <>
      {isLoading ? (<Spinner />) : (
        <div className="reset-container">
          <div className="reset-content">
            <div className="reset-header">
              <img className="reset-icon" src={resetIcon} alt="Lock Icon" />
              <div className="reset-title">
                <h1>RESET PASSWORD</h1>
                <p>Please enter your new password</p>
              </div>
            </div>
            <form
              className="reset-form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <input
                type="password"
                placeholder="New Password"
                className={errors.newPassword ? "reset-input-with-error" : ""}
                {...register("newPassword", {
                  required: "New Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              <p className="reset-error-message">{errors.newPassword?.message}</p>
              <input
                type="password"
                placeholder="Confirm Password"
                className={errors.confirmPassword ? "reset-input-with-error" : ""}
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                })}
              />
              <p className="reset-error-message">{errors.confirmPassword?.message}</p>
              <button type="submit">Reset Password</button>
            </form>
            <DevTool control={control} />
          </div>
          <div className="reset-left-background"></div>
          <div className="reset-right-background">
            <img className="reset-bg-image" src={bgImage} alt="Background" />
          </div>
        </div>
      )}
    </>
  );
}

export default ResetPassword;
