import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, SubmitHandler } from "react-hook-form";
import { RootState, AppDispatch } from "../../../redux/store";
import iconimage from "../../../../src/assets/images/User/UserHome/Account.png";
import { logout } from "../../../../src/redux/userSlice";
import { useNavigate } from "react-router-dom";
import { userEndpoints } from "../../../components/constraints/endpoints/userEndpoints";
import axiosInstance from '../../../components/constraints/axios/userAxios';
import {setUser} from '../../../../src/redux/userSlice'
import "./UserProfile.css";
import { toast } from 'sonner';

interface ProfileFormInputs {
  name: string;
  email: string;
  phone: string;
  about: string;
}

export default function ProfilePage() {
  const [profileImage, setProfileImage] = useState<string>(iconimage);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProfileFormInputs>({
    mode: "onBlur",
  });

  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    setProfileImage(user.profilePicture || iconimage);
    if (user) {
      setValue("name", user.username || "");
      setValue("email", user.email || "");
      setValue("phone", user.phone || "");
      setValue("about", user.bio || ".");
    }
  }, [user, setValue]);

  const onSubmit: SubmitHandler<ProfileFormInputs> = async (data) => {
    const formData = new FormData();

    // Append form fields
    formData.append("username", data.name); // Changed "name" to "username"
    formData.append("email", data.email);   // Added "email" field
    formData.append("phone", data.phone);
    formData.append("about", data.about);

    // Log formData entries for debugging
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    // Append the image file if it exists
    if (profileImageFile) {
      formData.append("profile_picture", profileImageFile);  
    }

    // Log formData entries after adding image
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    // Submit the formData to your backend
    try {
      const result = await axiosInstance.put(userEndpoints.profile, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
 
      if(!result){
        toast.error('Profile updated unsuccesful');
      }

      toast.success('Profile updated unsuccesful');

      console.log("Form submitted successfully", result);
      const profile_picture = result.data.profile_picture      
      const {_id,username,email,phone,about}=result.data._doc;
      console.log(profile_picture,"gotthe phonr value ;lllllllllllooooooooooooooook")
      dispatch(setUser({id:_id,username,email,bio:about,phone,profilePicture:profile_picture}));
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]; // Already handled correctly
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileImage(reader.result as string);
        };
        reader.readAsDataURL(file);
        setProfileImageFile(file); // Store the file in state
      } else {
        alert("Please select a valid image file.");
      }
    }
  };


  const logOut = () => {
    dispatch(logout());
    navigate("/login");
    localStorage.setItem("userAccessToken", "");
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest(".dropdown")) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  return (
    <div className="profile-page">
      <nav className="navbar">
        <input type="text" placeholder="Search..." className="search-bar" />
        <div className="navbar-content">
          <div className="nav-links">
            <span className="nav-item home">Home</span>
            <span className="nav-item courses">Courses</span>
          </div>
          <div className="nav-icons">
            <div className="nav-icon people"></div>
            <div className="dropdown">
              <img
                src={iconimage}
                alt="Menu Icon"
                className="dropdown-icon"
                onClick={toggleDropdown}
              />
              {isOpen && (
                <div className="dropdown-content show">
                  <button onClick={logOut} className="dropdown-link">
                    Logout
                  </button>
                  <button className="dropdown-link">Profile</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <div className="profile-heading">
        <h1>Profile</h1>
      </div>
      <div className="profile-container">
        <form className="left-section" onSubmit={handleSubmit(onSubmit)}>
          <div className="profile-image-container">
            <label htmlFor="imageUpload" className="profile-image-label">
              <img src={profileImage} alt="Profile" className="profile-image" />
            </label>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }} // Hide the input
            />
          </div>

          <div className="profile-info">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters long",
                },
              })}
              className="profile-input"
            />
            {errors.name && (
              <p className="error-message">{errors.name.message}</p>
            )}

            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email address",
                },
              })}
              className="profile-input"
            />
            {errors.email && (
              <p className="error-message">{errors.email.message}</p>
            )}

            <label htmlFor="phone">Phone</label>
            <input
              type="text"
              id="phone"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Phone number must be 10 digits long",
                },
              })}
              className="profile-input"
            />
            {errors.phone && (
              <p className="error-message">{errors.phone.message}</p>
            )}

            <label htmlFor="about">About</label>
            <textarea
              id="about"
              {...register("about")}
              className="profile-input profile-textarea"
            />
          </div>
          <button type="submit" className="edit-button">
            Edit Profile
          </button>
        </form>
        <div className="right-section">
          <h2>Update Password</h2>
          <form className="password-form">
            <label htmlFor="current-password">Current Password</label>
            <input
              type="password"
              id="current-password"
              placeholder="Enter current password"
              className="password-input"
            />
            <label htmlFor="new-password">New Password</label>
            <input
              type="password"
              id="new-password"
              placeholder="Enter new password"
              className="password-input"
            />
            <label htmlFor="confirm-password">Confirm New Password</label>
            <input
              type="password"
              id="confirm-password"
              placeholder="Confirm new password"
              className="password-input"
            />
            <button className="reset-button">Reset Password</button>
          </form>
        </div>
      </div>
    </div>
  );
}
