import React, { useState, useEffect } from "react";
import Navbar from "../../../components/User/Home/UserHome/Navbar/Navbar";
import CourseSections from "../../../components/User/CoursePurchased/CourseSection";
import CourseDetails from "../../../components/User/CoursePurchased/CourseView";
import iconimage from '../../../assets/images/User/UserHome/Account.png';
import axiosInstance from '../../../components/constraints/axios/userAxios';
import { userEndpoints } from "../../../components/constraints/endpoints/userEndpoints";
import { useParams } from 'react-router-dom';

const PurchasedSingleCourse: React.FC = () => {
  const [openSection, setOpenSection] = useState<number | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [course, setCourse] = useState<any>(null);  // State to hold course data

  const { courseId } = useParams();

  useEffect(() => {
    fetchCourse();
  }, []);

  const fetchCourse = async () => {
    try {
      if (courseId) {
        const response = await axiosInstance.get(
          userEndpoints.courseView.replace("courseId", courseId)
        );
        
        setCourse(response.data.courses);  // Update state with fetched course data
      }
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  };

  const toggleSection = (section: number) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleVideoClick = (videoUrl: string) => {
    setSelectedVideo(videoUrl);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0d1117]">
      <Navbar iconimage={iconimage} />

      <div style={{ marginTop: '70px' }} className="flex flex-col md:flex-row gap-8 p-6">
        <CourseDetails course={course} selectedVideo={selectedVideo} />
        
        <CourseSections
          course={course}
          tutor={{ _id: '', name: 'Unknown Tutor', email: 'N/A', phone: 0 }}
          openSection={openSection}
          toggleSection={toggleSection}
          handleVideoClick={handleVideoClick}
        />
      </div>
    </div>
  );
};

export default PurchasedSingleCourse;
