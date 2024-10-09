import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { BellIcon, ChatIcon, UserCircleIcon } from '@heroicons/react/outline';
import { RootState } from "../../../redux/store";
import axiosInstance from '../../../components/constraints/axios/tutorAxios';
import { tutorEndpoints } from "../../../components/constraints/endpoints/TutorEndpoints";
import {setTutor} from '../../../../src/redux/tutorSlice'
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from 'sonner';

interface ProfileFormInputs {
    name: string;
  email: string;
  phone: string;
  profilePic: string;
  about: string;
}

interface PasswordFormInputs {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export default function EditProfile() {
    const dispatch = useDispatch();
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<ProfileFormInputs>({
      defaultValues: {
        name: '',
        email: '',
        phone: '',
        profilePic: "",
        about: ''
      }
    });
  
    const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors } } = useForm<PasswordFormInputs>();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    
    const tutor = useSelector((state: RootState) => state.tutor);
  
    useEffect(() => {
      setProfileImage(tutor.profilePictureUrl || "");
      if (tutor) {
        setValue('name', tutor.tutorname || '');
        setValue('email', tutor.email || '');
        setValue('phone', tutor.phone || '');
        setValue('about', tutor.bio || '');
      }
    }, [tutor, setValue]);
  
    const fileInputRef = useRef<HTMLInputElement | null>(null);
  
    const generateFileName = (originalName: string) => {
      const extension = originalName.split(".").pop();
      return `${Math.random().toString(36).substring(2, 15)}.${extension}`;
    };
  
    const uploadProfile = async () => {
      if (!profileImageFile && !profileImage) {
        alert("Please select a file first!");
        return null;
      }
    
      try {
        const fileName = generateFileName(profileImageFile!.name);
    
        const response = await axios.get(tutorEndpoints.getPresignedUrlForUpload, {
          params: {
            filename: fileName,
            fileType: profileImageFile!.type.startsWith('image') ? 'image' : 'video',
          },
        });


        console.log(response.data,"git all the url")
    
        const { uploadUrl, viewUrl, key } = response.data;
    
        const result = await axios.put(uploadUrl, profileImageFile, {
          headers: {
            "Content-Type": profileImageFile!.type,
          },
        });
    
        if (result.status === 200) {
          return { url: viewUrl, key };
        } else {
          return null;
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        return null;
      }
    };
  
    const onSubmitProfile = async (data: ProfileFormInputs) => {
        console.log('Profile data submitted:', data);
      
        const formData = new FormData();
        formData.append("tutorname", data.name);
        formData.append("email", data.email);
        formData.append("phone", data.phone);
        formData.append("about", data.about);
      
        let profilePicKey: string = tutor.profilePicture || ""; 
        let profilePicUrl: string = profileImage; 
      
        // Only if a new image is selected for upload
        if (profileImageFile) {
          const profilePic = await uploadProfile();
          if (profilePic && profilePic.key) {
            profilePicKey = profilePic.key;  // This is the key of the uploaded image
            profilePicUrl = profilePic.url;  // This is the URL to display the uploaded image
            setProfileImage(profilePicUrl);
          }
        }
      
        if (profilePicKey) {
          formData.append("profile_picture", profilePicKey); // Append the uploaded image key, not profilePic
        }
      
        // Log FormData to verify
        for (const [key, value] of formData.entries()) {
          console.log(key, value);
        }
      
        try {
          const result = await axiosInstance.put(tutorEndpoints.editProfile, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
      
          if (result.status === 200) {
            toast.success('Profile updated successfully');
            const { _id, tutorname, email, phone, about } = result.data._doc;
            dispatch(setTutor({
              id: _id,
              tutorname,
              email,
              bio: about,
              phone,
              profilePicture: profilePicKey,  // Save the image key in the store
              profilePictureUrl: profilePicUrl // Save the image URL in the store
            }));
          } else {
            toast.error('Profile update failed');
          }
        } catch (error) {
          console.error("Error submitting form", error);
          toast.error('Error submitting profile update');
        }
      };
      
      
  
    const onSubmitPassword = (data: PasswordFormInputs) => {
      if (data.newPassword !== data.confirmNewPassword) {
        alert('Passwords do not match!');
        return;
      }
      console.log('Password reset data:', data);
    };
  
    const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileImage(reader.result as string);
        };
        reader.readAsDataURL(file);
        setProfileImageFile(file); 
      }
    };
  
    const toggleDropdown = () => {
      setDropdownOpen(!dropdownOpen);
    };
  
    const handleProfilePicClick = () => {
      fileInputRef.current?.click(); 
    };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-gray-800 p-4 flex justify-between items-center">
        {/* Left side (Logo or Brand Name) */}
        <div className="text-white text-xl font-bold">Tutor </div>

        {/* Right side (Icons: Notifications, Messages, Profile) */}
        <div className="flex items-center space-x-6">
          {/* Notification Icon */}
          <div className="relative">
            <BellIcon className="h-6 w-6 text-white cursor-pointer" />
            <span className="absolute top-0 right-0 inline-flex items-center justify-center h-3 w-3 rounded-full bg-red-500 text-white text-xs">
              3
            </span>
          </div>

          {/* Message Icon */}
          <div className="relative">
            <ChatIcon className="h-6 w-6 text-white cursor-pointer" />
            <span className="absolute top-0 right-0 inline-flex items-center justify-center h-3 w-3 rounded-full bg-red-500 text-white text-xs">
              5
            </span>
          </div>

          {/* Profile Icon with Dropdown */}
          <div className="relative">
            <UserCircleIcon
              className="h-8 w-8 text-white cursor-pointer"
              onClick={toggleDropdown}
            />
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-lg">
                <ul className="py-2">
                  <li className="px-4 py-2 hover:bg-gray-600 cursor-pointer">
                    Dashboard
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-600 cursor-pointer">
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Profile Edit Form */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

            {/* Profile Picture Preview */}
            <div className="mb-4 flex justify-center">
              <div
                className={"w-32 h-32 rounded-full bg-gray-600 overflow-hidden "}
                onClick={handleProfilePicClick}
              >
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-full h-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                )}
              </div>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              accept="image/*"
              {...register('profilePic')}
              ref={fileInputRef}
              className="hidden"
              onChange={handleProfilePicChange}
            />

            <form onSubmit={handleSubmit(onSubmitProfile)}>
              <div className="mb-4">
                <label className="block text-gray-400">Name</label>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-gray-400">Email</label>
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-gray-400">Phone</label>
                <input
                  type="text"
                  {...register('phone', { required: 'Phone number is required' })}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-gray-400">Description</label>
                <textarea
                  {...register('about', { required: 'Description is required' })}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                />
                {errors.about && <p className="text-red-500 text-sm">{errors.about.message}</p>}
              </div>


              
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                >
                  Save Changes
                </button>
            </form>
          </div>

          {/* Password Reset Form */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Reset Password</h2>

            <form onSubmit={handlePasswordSubmit(onSubmitPassword)}>
              <div className="mb-4">
                <label className="block text-gray-400">Current Password</label>
                <input
                  type="password"
                  {...registerPassword('currentPassword', { required: 'Current password is required' })}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                />
                {passwordErrors.currentPassword && <p className="text-red-500 text-sm">{passwordErrors.currentPassword.message}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-gray-400">New Password</label>
                <input
                  type="password"
                  {...registerPassword('newPassword', { required: 'New password is required' })}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                />
                {passwordErrors.newPassword && <p className="text-red-500 text-sm">{passwordErrors.newPassword.message}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-gray-400">Confirm New Password</label>
                <input
                  type="password"
                  {...registerPassword('confirmNewPassword', { required: 'Please confirm your new password' })}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                />
                {passwordErrors.confirmNewPassword && <p className="text-red-500 text-sm">{passwordErrors.confirmNewPassword.message}</p>}
              </div>

              <button
                type="submit"
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Reset Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
