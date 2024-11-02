import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BellIcon, ChatIcon, UserCircleIcon } from '@heroicons/react/outline'; // Updated for v2 Heroicons
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import axios from 'axios';
import { tutorEndpoints } from '../../constraints/endpoints/TutorEndpoints';

export default function TutorProfile() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string>("");
  const navigate = useNavigate()

  // Get tutor data from Redux store
  const tutor = useSelector((state: RootState) => state.tutor);

  // Set profile image and form fields when the tutor data is available
  useEffect(() => {
    console.log(tutor," i got the tutor redux value")
    fetchProfilSignedUrl();
  }, [tutor]);


  const fetchProfilSignedUrl = async () => {
    try {
      const response = await axios.get(tutorEndpoints.getPresignedUrl, {
        params: {
          s3Key: tutor.profilePicture, // Assuming profilePicture contains the S3 key
        },
      });
      const s3Url = response.data.url;
      if (s3Url) setProfileImage(s3Url);  // Set the profileImage to S3 URL
    } catch (error) {
      console.error("Error fetching S3 URL:", error);
    }
  };



  // Toggle dropdown for profile menu
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };


  const goEditProfile = () =>{
    navigate("/tutor/editProfile")
  }

  const GoDashboard = () =>{
    navigate("/tutor/dashboard")
  }

  return (
    <>
      {/* Custom Navbar */}
      <nav className="bg-gray-800 p-4 flex justify-between items-center">
        {/* Left side (Logo or Brand Name) */}
        <div className="text-white text-xl font-bold">Tutor Dashboard</div>

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
                  <li onClick={GoDashboard} className="px-4 py-2 hover:bg-gray-600 cursor-pointer">
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
      <div className="bg-gray-900 text-white min-h-screen p-8">
        {/* Profile Banner */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {/* Display profile image or a placeholder */}
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="bg-yellow-500 p-4 rounded-full text-black font-bold text-xl">
                  {tutor.tutorname ? tutor.tutorname[0].toUpperCase() : "A"}
                </div>
              )}

              <div>
                <h1 className="text-3xl font-bold">
                  Hi, {tutor.tutorname || "Anna"}
                </h1>
                <p className="text-gray-400">Email: {tutor.email || "alis@gmail.com"}</p>
              </div>
            </div>
            <button onClick={goEditProfile} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Profile Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <div className="text-4xl font-bold">{tutor.courses?.length || 1}</div>
            <p className="text-gray-400">Total Courses</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <div className="text-4xl font-bold">{tutor.studentsCount || 1}</div>
            <p className="text-gray-400">Total Students</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <div className="text-4xl font-bold">{tutor.yearsOfExperience || 5}</div>
            <p className="text-gray-400">Years of Experience</p>
          </div>
        </div>

        {/* Education Section */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Education</h2>
          <ul className="space-y-2">
            {tutor.education?.map((degree, index) => (
              <li key={index}>{degree}</li>
            )) || <li>BSc Computer Science</li>}
          </ul>
        </div>

        {/* Course List Section */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Course List</h2>
          <div className="space-y-4">
            {tutor.courses?.map((course, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-lg shadow-lg flex justify-between items-center">
                <div>
                  <p className="text-gray-400">{course.level || "Beginner"}</p>
                  <h3 className="text-lg font-bold">{course.title || "Course Title"}</h3>
                </div>
              </div>
            )) || (
              <div className="bg-gray-700 p-4 rounded-lg shadow-lg flex justify-between items-center">
                <div>
                  <p className="text-gray-400">Beginner</p>
                  <h3 className="text-lg font-bold">C# & .NET Core</h3>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
