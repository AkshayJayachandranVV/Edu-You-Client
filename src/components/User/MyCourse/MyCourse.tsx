import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Make sure to import useNavigate
import Navbar from '../../User/Home/UserHome/Navbar/Navbar'; 
import Footer from '../../User/Home/UserHome/Footer/Footer'; 
import iconimage from '../../../assets/images/User/UserHome/Account.png';
import MycourseImage from '../../../assets/images/User/myCourses background.png';
import axiosInstance from '../../../components/constraints/axios/userAxios';
import { userEndpoints } from "../../../components/constraints/endpoints/userEndpoints";

// Define an interface for course structure
interface Course {
  _id: string;
  thumbnail: string;
  courseName: string;
  lectures: number;
}

export default function MyCourses() {
  const [courses, setCourses] = useState<Course[]>([]); // Use the Course type for courses state
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchCourseDetails = async () => {
      const userId = localStorage.getItem("userId");
      console.log("User ID from local storage:", userId);
  
      if (userId) {
        try {
          const endpoint = `${userEndpoints.myCourse.replace('userId', userId)}`;
          console.log("Fetching from endpoint:", endpoint);
  
          const allCourses = await axiosInstance.get(endpoint);
          console.log("Data received:", allCourses.data);
          
          if (allCourses.data.success) {
            // Normalize the courses data
            const normalizedCourses = allCourses.data.courses.map((course:any) => ({
              ...course._doc,   // Spread the _doc properties
              thumbnail: course.thumbnail,  // Add the thumbnail separately
            }));
            
            setCourses(normalizedCourses);
          } else {
            console.error("No success in response:", allCourses.data);
            setCourses([]);
          }
        } catch (error) {
          console.error("Error fetching courses:", error);
        }
      } else {
        console.error("User ID not found in localStorage.");
      }
    };
  
    fetchCourseDetails();
  }, []);
  

  const CourseView = (courseId: string) => {
    console.log(courseId)
    navigate(`/courseView/${courseId}`);
  };

  return (
    <div className="my-courses bg-[#111827] text-white min-h-screen flex flex-col">
      <Navbar iconimage={iconimage} />
       
      {/* Banner Section */}
      <div className="relative bg-black p-6" style={{ minHeight: "150px" }}>
        <img
          src={MycourseImage}
          alt="Banner"
          className="w-[700px] h-[400px] object-cover mb-4"
          style={{ marginLeft: "700px", marginTop: "60px" }}
        />
        <div className="absolute" style={{ top: "40%", left: "210px", transform: "translateY(-50%)" }}>
          <h1 className="font-bold text-white" style={{ fontSize: "70px" }}>
            Online Education
          </h1>
          <p className="text-gray-300 mt-4 max-w-md" style={{ fontSize: "18px" }}>
            "Empowering minds from any place, at any time. Online education connects learners globally, offering knowledge and skills for a better future."
          </p>
          <button className="bg-teal-500 px-6 py-3 rounded text-lg font-bold mt-6">
            Try it Now
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-12 py-2 flex-grow">
        <h2 className="text-7xl font-bold mt-16 mb-10 text-center">My Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.length === 0 ? (
            <p className="text-center text-gray-400 text-xl">No enrolled courses found.</p>
          ) : (
            courses.map((course) => (
              <div
                onClick={() => CourseView(course._id)} // Wrap the function in an anonymous function
                key={course._id}
                className="bg-[#040509] p-6 rounded-lg shadow-md flex flex-col cursor-pointer"
              >
                <div
                  className="mb-4 h-40 bg-cover bg-center rounded"
                  style={{ backgroundImage: `url(${course.thumbnail})` }}
                ></div>
                <h3 className="text-xl font-semibold mb-2">{course.courseName}</h3>
                <p className="text-gray-400 mb-4">{course.lectures} Lectures</p>
                <button className="mt-auto bg-teal-500 py-2 px-4 rounded font-bold">
                  Watch now
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="pb-16"></div>
      
      <Footer />
    </div>
  );
}
