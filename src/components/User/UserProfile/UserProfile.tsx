import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, SubmitHandler } from "react-hook-form";
import { RootState, AppDispatch } from "../../../redux/store";
import iconimage from "../../../../src/assets/images/User/UserHome/Account.png";
import { logout } from "../../../../src/redux/userSlice";
import { useNavigate } from "react-router-dom";
import { userEndpoints } from "../../../components/constraints/endpoints/userEndpoints";
import axiosInstance from '../../../components/constraints/axios/userAxios';
import { tutorEndpoints } from "../../../components/constraints/endpoints/TutorEndpoints";
import {setUser} from '../../../../src/redux/userSlice'
import axios from "axios";
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
    if (user) {
      setValue("name", user.username || "");
      setValue("email", user.email || "");
      setValue("phone", user.phone || "");
      setValue("about", user.bio || ".");
      fetchProfilSignedUrl();  // Fetch the S3 URL for profile picture
    }
  }, [user, setValue]);

  const fetchProfilSignedUrl = async () => {
    try {
      const response = await axios.get(tutorEndpoints.getPresignedUrl, {
        params: {
          s3Key: user.profilePicture, // Assuming profilePicture contains the S3 key
        },
      });
      const s3Url = response.data.url;
      if (s3Url) setProfileImage(s3Url);  // Set the profileImage to S3 URL
    } catch (error) {
      console.error("Error fetching S3 URL:", error);
    }
  };



  const generateFileName = (originalName: string) => {
    const extension = originalName.split(".").pop();
    return `${Math.random().toString(36).substring(2, 15)}.${extension}`;
  };


  const uploadProfile = async () => {
    console.log("Entered uploadThumbnail");
  
    // If no new file and no preview image, return the existing thumbnail info
    if (!profileImageFile && !profileImage) {
      alert("Please select a file first!");
      return null;
    }
  
    // If there's a preview image but no new file, use the existing key and URL
   
  
    try {
      const fileName = generateFileName(profileImageFile!.name);
  
      const response = await axios.get(tutorEndpoints.getPresignedUrlForUpload, {
        params: {
          filename: fileName,
          fileType: profileImageFile!.type.startsWith('image') ? 'image' : 'video',
        },
      });
  
      const { uploadUrl, viewUrl, key } = response.data;
  
      console.log("S3 key:", key, "View URL:", viewUrl);
  
      const result = await axios.put(uploadUrl, profileImageFile, {
        headers: {
          "Content-Type": profileImageFile!.type,
        },
      });
  
      if (result.status === 200) {

        console.log("success the generation")
  
        return { url: viewUrl, key };
      } else {
        console.log("unsuccessfull")
        return null;
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  };

  const onSubmit: SubmitHandler<ProfileFormInputs> = async (data) => {
    const formData = new FormData();
  
    // Append form fields
    formData.append("username", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("about", data.about);
  
    // Initialize profilePicKey
    let profilePicKey: string = user.profilePicture || ""; 
    let profilePicUrl: string = profileImage; // Initially, the preview image (if exists)
  
    if (profileImageFile) {
      const profilePic = await uploadProfile();  // Upload new image if a file is selected
      console.log(profilePic, "key url");
      if (profilePic && profilePic.key) {
        profilePicKey = profilePic.key; // Update with the new S3 key
        profilePicUrl = profilePic.url; // Use the S3 URL after upload
        setProfileImage(profilePicUrl); // Set the image URL from S3 for display
      }
    }
  
    // Check and log to ensure profileImage contains the correct S3 URL
    console.log(profileImage, "Profile Image after upload",profilePicKey);
  
    // Ensure profilePicKey is not empty or undefined before appending
    if (profilePicKey) {
      formData.append("profile_picture", profilePicKey); // Append the key
    } else {
      console.warn("No profile picture available to upload.");
    }
  
    try {
      const result = await axiosInstance.put(userEndpoints.profile, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(result)
  
      if (result.status === 200) {
        toast.success('Profile updated successfully');
        const { _id, username, email, phone, about } = result.data;
        dispatch(setUser({
          id: _id,
          username,
          email,
          bio: about,
          phone,
          profilePicture: profilePicKey, 
          profilePictureUrl: profilePicUrl // Make sure the URL is updated in state
        }));
        console.log(profileImage, "Profile Image state after form submission");
      } else {
        toast.error('Profile update failed');
      }
    } catch (error) {
      console.error("Error submitting form", error);
      toast.error('Error submitting profile update');
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
