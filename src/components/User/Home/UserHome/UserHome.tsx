import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../Home/UserHome/Navbar/Navbar";
import Footer from "../../Home/UserHome/Footer/Footer";
import { courseEndpoints} from "../../../constraints/endpoints/courseEndpoints";
import banner from '../../../../assets/images/User/UserHome/userHome.png'
import aboutUs from '../../../../assets/images/User/UserHome/aboutUs.webp'

interface Course {
  _id: string;
  thumbnail: string;
  thumbnailUrl?: string;
  courseName: string;
  courseDescription: string;
  coursePrice: string;
}

export default function UserHome() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]); // Explicitly typing the courses state=
  

  const handleCardClick = (courseId:string) => {
    // Call your function here
    console.log(`Course ID clicked: ${courseId}`);

    // Navigate to the course details page
    navigate(`/courseDetails/${courseId}`);
  };

  const allCourse = ()=>{
    navigate('/allCourses')
  }

  useEffect(() => {
    fetchData();
  }, []);



  const fetchData = async () => {
    try {
      const result = await axios.get(courseEndpoints.userCourse);
      setCourses(result.data.courses); // Store fetched courses in state
  
      console.log(result.data.courses);
  
      // Generate signed URLs for each course's thumbnail
      const initialUrls = await result.data.courses.reduce(async (accPromise:any, course:Course) => {
        const acc = await accPromise; // Await the previous accumulator promise
        const data = {
          imageKey: course.thumbnail // Use the original thumbnail key
        };
  
        console.log(data);
        const response = await axios.post('http://localhost:4000/tutor/getSignedUrlId', data); // Await the axios post
        console.log(response.data, "--------------------url");
        
        // Assign the signed URL to the course object
        acc.push({ ...course, thumbnailUrl: response.data }); // Store the signed URL in thumbnailUrl
        return acc;
      }, Promise.resolve([])); // Start with an empty array
  
      setCourses(initialUrls); // Set updated courses with thumbnailUrl
    } catch (error) {
      console.log(error);
    }
  };
  



  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar
      />

      {/* Hero Section */}
      <div className="relative w-full px-4 py-16 md:py-24 lg:py-32">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Text Content */}
            <div className="w-full lg:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
                Discover
                <br />
                the professions
                <br />
                of the future
              </h1>
              <p className="text-lg md:text-xl opacity-80">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Phasellus imperdiet, nulla et dictum interdum,
                nisi lorem egestas odio, vitae scelerisque enim ligula.
              </p>
              <button 
                onClick={allCourse}
                className="bg-[#16ECCA] hover:bg-[#14b3b0] text-white px-8 py-3 rounded-md text-lg transition-colors duration-300"
              >
                Get Started
              </button>
            </div>
            
            {/* Image */}
            <div className="w-full lg:w-1/2">
              <div className="relative h-64 md:h-96 lg:h-[400px] rounded-lg overflow-hidden">
                <img 
                  src={banner}
                  alt="Hero"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Courses Section */}
      <div className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12">
            Featured Courses
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.length > 0 ? (
              courses.map((course, index) => (
                <div
                  key={index}
                  onClick={() => handleCardClick(course._id)}
                  className="bg-white rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 cursor-pointer"
                >
                  <div className="relative h-48 md:h-64">
                    <img
                      src={course.thumbnailUrl}
                      alt={course.courseName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-black text-xl font-bold mb-2">{course.courseName}</h3>
                    <p className="text-gray-600 mb-4">{course.courseDescription}</p>
                    <p className="text-[#16ECCA] text-2xl font-bold">Rs. {course.coursePrice}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-xl">No courses available at the moment.</p>
            )}
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <div className="py-16 md:py-24 border-t border-white/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Image */}
            <div className="w-full lg:w-1/2">
              <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
                <img
                  src={aboutUs}
                  alt="About Us"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Content */}
            <div className="w-full lg:w-1/2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">About Us</h2>
              <p className="text-lg opacity-80">
                Lorem Ipsum has been the industry's standard dummy text
                ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
                Versions of the Lorem ipsum text have been used in typesetting
                at least since the 1960s, when it was popularized by advertisements
                for Letraset transfer sheets.
              </p>
              <button className="bg-[#16ECCA] hover:bg-[#14b3b0] text-white px-8 py-3 rounded-md text-lg transition-colors duration-300">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}