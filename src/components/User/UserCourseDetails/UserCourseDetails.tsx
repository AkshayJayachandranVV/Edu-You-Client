import { useEffect, useState } from "react";
import Navbar from '../../User/Home/UserHome/Navbar/Navbar';
import Footer from '../../User/Home/UserHome/Footer/Footer';
import iconimage from '../../../assets/images/User/UserHome/Account.png';
import axiosInstance from '../../../components/constraints/axios/userAxios';
import { userEndpoints } from "../../../components/constraints/endpoints/userEndpoints";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';

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

export default function UserCourseDetails() {
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState<Course | null>(null);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        if (courseId) {
          const response = await axiosInstance.get(
            `${userEndpoints.courseDetails.replace('courseId', courseId)}`
          );
          setCourseData(response.data.courses);
        } else {
          console.error("Course ID is undefined");
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const getYouTubeID = (url: string) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag: HTMLScriptElement | null = document.getElementsByTagName('script')[0];
    if (firstScriptTag && firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    window.onYouTubeIframeAPIReady = () => {
      // YouTube API logic here
    };
  }, []);

  const coursePayment = async(courseId:string)=>{
    navigate(`/checkout/${courseId}`)
  }

  if (!courseData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="course-description bg-black text-gray-100">
      <Navbar iconimage={iconimage} />
      <div className="bg-gradient-to-r from-gray-900 to-black mt-12 shadow-lg">
        <div className="container mx-auto flex flex-col lg:flex-row items-center lg:items-start py-10 space-y-6 lg:space-y-0 lg:space-x-10">
          <div className="course-banner flex-1">
            <iframe
              className="w-full h-64 lg:h-96 object-cover rounded-lg shadow-lg"
              src={`https://www.youtube.com/embed/${getYouTubeID(courseData.demoURL)}`}
              title={courseData.courseName}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="flex-1 lg:w-2/3 space-y-4">
            <h1 className="text-4xl font-bold text-white">{courseData.courseName}</h1>
            <p className="text-gray-400">{courseData.courseDescription}</p>
            <div className="flex items-center space-x-6 text-gray-400">
              <span className="text-yellow-400">No Rating</span>
              <span>9 Enrolled</span>
              <span>English</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 py-12">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-8 ml-8">
  <div>
    <h2 className="text-2xl font-semibold text-white">This course includes:</h2>
    <ul className="mt-4 space-y-2 text-gray-400">
      <li>1 Lecture</li>
      <li>1hr 0min Duration</li>
      <li>{courseData.courseLevel} Level</li>
      <li>English</li>
    </ul>
  </div>

  <div>
    <h2 className="text-2xl font-semibold text-white">What you’ll learn:</h2>
    <ul className="mt-4 space-y-2 text-gray-400">
      {courseData.benefits.map((benefit, index) => (
        <li key={index}>{benefit}</li>
      ))}
    </ul>
  </div>

  <div>
    <h2 className="text-2xl font-semibold text-white">Course Description:</h2>
    <p className="mt-4 text-gray-400">{courseData.courseDescription}</p>
  </div>
</div>


          <div className="bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
            <img
              className="w-full object-cover rounded-lg shadow-lg"
              src={courseData.thumbnail}
              alt={courseData.courseName}
            />
            <h2 className="text-2xl font-semibold text-white">Price: ₹ {courseData.coursePrice}</h2>
            <button onClick={coursePayment(courseData._id)} className="w-full py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all">
              Buy Now
            </button>
            <p className="text-gray-500">Created by {courseData.courseCategory}</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
