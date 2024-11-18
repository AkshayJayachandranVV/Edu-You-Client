import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, SubmitHandler } from "react-hook-form";
import { RootState, AppDispatch } from "../../../redux/store";
import iconimage from "../../../../src/assets/images/User/UserHome/Account.png";
import { userEndpoints } from "../../../components/constraints/endpoints/userEndpoints";
import axiosInstance from "../../../components/constraints/axios/userAxios";
import { tutorEndpoints } from "../../../components/constraints/endpoints/TutorEndpoints";
import { setUser } from "../../../../src/redux/userSlice";
import Navbar from "../Home/UserHome/Navbar/Navbar";
import { useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";

interface ProfileFormInputs {
  name: string;
  email: string;
  phone: string;
  about: string;
}

export default function ProfilePage() {
  const [profileImage, setProfileImage] = useState<string>(iconimage);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProfileFormInputs>({
    mode: "onBlur",
  });

  const user = useSelector((state: RootState) => state.user);

 
  

  const fetchProfilSignedUrl = useCallback(async () => {
    try {
      const response = await axios.get(tutorEndpoints.getPresignedUrl, {
        params: {
          s3Key: user.profilePicture, // Assuming profilePicture contains the S3 key
        },
      });
      const s3Url = response.data.url;
      if (s3Url) setProfileImage(s3Url); // Set the profileImage to S3 URL
    } catch (error) {
      console.error("Error fetching S3 URL:", error);
    }
  }, [user.profilePicture]); 


  useEffect(() => {
    if (user) {
      setValue("name", user.username || "");
      setValue("email", user.email || "");
      setValue("phone", user.phone || "");
      setValue("about", user.bio || ".");
      fetchProfilSignedUrl(); 
    }
  }, [user, setValue, fetchProfilSignedUrl]);

  const generateFileName = (originalName: string) => {
    const extension = originalName.split(".").pop();
    return `${Math.random().toString(36).substring(2, 15)}.${extension}`;
  };

  const uploadProfile = async () => {
    console.log("Entered uploadThumbnail");

    // If no new file and no preview image, return the existing thumbnail info
    if (!profileImageFile && !profileImage) {
      toast.info("Please select a file first!");
      return null;
    }

    // If there's a preview image but no new file, use the existing key and URL

    try {
      const fileName = generateFileName(profileImageFile!.name);

      const response = await axios.get(
        tutorEndpoints.getPresignedUrlForUpload,
        {
          params: {
            filename: fileName,
            fileType: profileImageFile!.type.startsWith("image")
              ? "image"
              : "video",
          },
        }
      );

      const { uploadUrl, viewUrl, key } = response.data;

      console.log("S3 key:", key, "View URL:", viewUrl);

      const result = await axios.put(uploadUrl, profileImageFile, {
        headers: {
          "Content-Type": profileImageFile!.type,
        },
      });

      if (result.status === 200) {
        console.log("success the generation");

        return { url: viewUrl, key };
      } else {
        console.log("unsuccessfull");
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
      const profilePic = await uploadProfile(); // Upload new image if a file is selected
      console.log(profilePic, "key url");
      if (profilePic && profilePic.key) {
        profilePicKey = profilePic.key; // Update with the new S3 key
        profilePicUrl = profilePic.url; // Use the S3 URL after upload
        setProfileImage(profilePicUrl); // Set the image URL from S3 for display
      }
    }

    // Check and log to ensure profileImage contains the correct S3 URL
    console.log(profileImage, "Profile Image after upload", profilePicKey);

    // Ensure profilePicKey is not empty or undefined before appending
    if (profilePicKey) {
      formData.append("profile_picture", profilePicKey); // Append the key
    } else {
      console.warn("No profile picture available to upload.");
    }

    try {
      const result = await axiosInstance.put(userEndpoints.profile, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(result);

      if (result.status === 200) {
        toast.success("Profile updated successfully");
        const { _id, username, email, phone, about } = result.data;
        dispatch(
          setUser({
            id: _id,
            username,
            email,
            bio: about,
            phone,
            profilePicture: profilePicKey,
            profilePictureUrl: profilePicUrl, // Make sure the URL is updated in state
          })
        );
        console.log(profileImage, "Profile Image state after form submission");
      } else {
        toast.error("Profile update failed");
      }
    } catch (error) {
      console.error("Error submitting form", error);
      toast.error("Error submitting profile update");
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






  return (
    <div className="profile-page bg-black flex flex-col items-center min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Profile Heading */}
      <div className="profile-heading text-white text-center mt-20 sm:mt-28">
        <h1 className="text-4xl sm:text-5xl font-bold">Profile</h1>
      </div>

      {/* Profile Container */}
      <div className="profile-container bg-gray-900 p-6 sm:p-10 rounded-lg shadow-lg flex flex-col md:flex-row justify-between items-center w-full max-w-5xl mt-8 gap-8">
        {/* Left Section */}
        <form
          className="left-section flex flex-col items-center w-full md:w-1/2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="profile-image-container">
            <label htmlFor="imageUpload" className="cursor-pointer">
              <img
                src={profileImage}
                alt="Profile"
                className="profile-image w-40 h-40 rounded-full border-4 border-teal-400 object-cover"
              />
            </label>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <div className="profile-info w-full mt-6 space-y-4">
            <div>
              <label htmlFor="name" className="text-teal-400 block mb-1">
                Name
              </label>
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
                className="profile-input bg-gray-800 text-white rounded-md p-3 w-full focus:outline-none"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="text-teal-400 block mb-1">
                Email
              </label>
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
                className="profile-input bg-gray-800 text-white rounded-md p-3 w-full focus:outline-none"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="text-teal-400 block mb-1">
                Phone
              </label>
              <input
                type="text"
                id="phone"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Invalid phone number",
                  },
                })}
                className="profile-input bg-gray-800 text-white rounded-md p-3 w-full focus:outline-none"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="about" className="text-teal-400 block mb-1">
                About
              </label>
              <textarea
                id="about"
                {...register("about", { required: "About is required" })}
                className="profile-input bg-gray-800 text-white rounded-md p-3 w-full focus:outline-none"
              />
              {errors.about && (
                <p className="text-red-500 text-sm">{errors.about.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="submit-button bg-teal-500 text-white rounded-md p-4 mt-6 w-full"
          >
            Update Profile
          </button>
        </form>


        {/* Right Section */}
        <div className="right-section flex flex-col w-full md:w-1/2 mt-8 md:mt-0">
          <h2 className="text-teal-400 text-2xl font-bold text-center mb-6">
            Update Password
          </h2>
          <form className="password-form space-y-4">
            <div>
              <label
                htmlFor="current-password"
                className="text-teal-400 block mb-1"
              >
                Current Password
              </label>
              <input
                type="password"
                id="current-password"
                placeholder="Enter current password"
                className="password-input bg-gray-800 text-white rounded-md p-3 w-full focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="new-password"
                className="text-teal-400 block mb-1"
              >
                New Password
              </label>
              <input
                type="password"
                id="new-password"
                placeholder="Enter new password"
                className="password-input bg-gray-800 text-white rounded-md p-3 w-full focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="text-teal-400 block mb-1"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirm-password"
                placeholder="Confirm new password"
                className="password-input bg-gray-800 text-white rounded-md p-3 w-full focus:outline-none"
              />
            </div>
            <button className="reset-button bg-teal-400 text-gray-900 rounded-md px-4 py-2 mt-4 hover:bg-teal-500">
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
