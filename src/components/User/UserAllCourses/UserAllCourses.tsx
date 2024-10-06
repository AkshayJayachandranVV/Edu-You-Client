import React, { useEffect, useState } from 'react';
import iconimage from '../../../assets/images/User/UserHome/Account.png';
import Navbar from '../../User/Home/UserHome/Navbar/Navbar'; 
import Footer from '../../User/Home/UserHome/Footer/Footer'; 
import axiosInstance from '../../../components/constraints/axios/userAxios';
import { userEndpoints } from "../../../components/constraints/endpoints/userEndpoints";
import { useNavigate } from "react-router-dom";
// Interface for course structure
interface Course {
  _id: string;
  courseName: string;
  courseDescription: string;
  coursePrice: number;
  courseDiscountPrice?: number;
  courseCategory: string;
  courseLevel: string;
  demoURL: string;
  prerequisites: string[];
  benefits: string[];
  sections: { title: string, lessons: { title: string, description: string }[] }[];
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
}

export default function AllCourses() {
  const [courseData, setCourseData] = useState<Course[]>([]);
  const navigate=useNavigate()

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const allCourses = await axiosInstance.get(userEndpoints.allCourses);
        console.log(allCourses.data, "gotcha");
        if (allCourses.data && allCourses.data) {
          setCourseData(allCourses.data); // Set course data array
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourseDetails();
  }, []);



  const UserCourseDetails = (courseId:string) => {
    // Call your function here
    console.log(`Course ID clicked: ${courseId}`);

    // Navigate to the course details page
    navigate(`/courseDetails/${courseId}`);
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navbar iconimage={iconimage} />

      {/* Banner Section */}
      <div className="bg-gray-800 py-12 text-center mt-14">
        <h1 className="text-5xl font-bold text-yellow-400">All Courses</h1>
        <p className="text-gray-400 mt-4">Explore our wide range of courses and choose the best fit for you.</p>
      </div>

      {/* Courses Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-gray-700 p-8 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {courseData.length > 0 ? (
              courseData.map((course) => (
                <div 
                  onClick={()=>{UserCourseDetails(course._id)}}
                  key={course._id} 
                  className="bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-yellow-400">{course.courseName}</h2>
                    <p className="text-gray-400 mt-2">{course.courseDescription}</p>
                    <div className="flex justify-between items-center mt-4">
                      {/* Display Discount Price if available, otherwise show regular price */}
                      {course.courseDiscountPrice ? (
                        <>
                          <span className="text-lg font-bold text-yellow-400 line-through">{`Rs.${course.coursePrice}`}</span>
                          <span className="text-lg font-bold text-yellow-400 ml-2">{`Rs.${course.courseDiscountPrice}`}</span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-yellow-400">{`Rs.${course.coursePrice}`}</span>
                      )}
                    </div>
                    <button className="mt-4 w-full bg-yellow-500 text-gray-900 font-bold py-2 rounded-md hover:bg-yellow-600 transition-all duration-300">
                      Enroll Now
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400">No courses available.</p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
