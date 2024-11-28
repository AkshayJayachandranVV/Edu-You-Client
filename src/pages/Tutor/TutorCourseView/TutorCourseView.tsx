import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CourseSections from "../../../components/Tutor/TutorCourseView/TutorCourseSection";
import CourseDetails from "../../../components/Tutor/TutorCourseView/TutorCourseDetails";
import { IconButton, Tooltip } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import axiosInstance from "../../../components/constraints/axios/tutorAxios";
import { tutorEndpoints } from "../../../components/constraints/endpoints/TutorEndpoints";
import { useNavigate } from "react-router-dom";


const CourseView: React.FC = () => {
  const [openSection, setOpenSection] = useState<number | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [course, setCourse] = useState<any>(null);
  const navigate = useNavigate()
  const { courseId } = useParams();


  const GoLive = async () => {
    // const courseId = courseId; 
    navigate(`/tutor/GoLive/${courseId}`);
  };
 

  useEffect(() => {
    fetchCourse();
  });

  const fetchCourse = async () => {
    try {
      if (courseId) {
        const response = await axiosInstance.get(
          tutorEndpoints.courseView.replace("courseId", courseId)
        );
        if (response.data.courses) {
          const courseData = response.data.courses;
          setCourse({
            id: courseData._id,
            courseName: courseData.courseName,
            courseDescription: courseData.courseDescription,
            coursePrice: courseData.coursePrice,
            courseDiscountPrice: courseData.courseDiscountPrice,
            courseCategory: courseData.courseCategory,
            courseLevel: courseData.courseLevel,
            demoURL: courseData.demoURL,
            thumbnailUrl: courseData.thumbnailUrl || null,
            prerequisites: courseData.prerequisites || [],
            benefits: courseData.benefits || [],
            sections: courseData.sections.map((section:any) => ({
              title: section.title,
              lessons: section.lessons.map((lesson:any) => ({
                title: lesson.title || "",
                description: lesson.description || "",
                video: lesson.video || "",
                displayVideo: lesson.displayVideo || "",
              })),
            })),
          });
        }
      }
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  };

  const toggleSection = (sectionIndex: number) => {
    setOpenSection(openSection === sectionIndex ? null : sectionIndex);
  };

  const handleVideoClick = (videoUrl: string) => {
    setSelectedVideo(videoUrl);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0d1117] text-gray-200">
      <div
        style={{ marginTop: "70px" }}
        className="flex justify-between items-center px-8 py-4 bg-[#161b22]"
      >
        <h1 className="text-3xl font-semibold text-teal-400">
          {course?.courseName}
        </h1>
        <div className="flex space">
          <Tooltip title="Chat">
            <IconButton
              color="primary"
              sx={{
                fontSize: "3rem",
                padding: "24px", 
              }}
            >
              <ChatIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
          <Tooltip onClick={GoLive} title="Live Streaming">
            <IconButton
              color="secondary"
              sx={{
                fontSize: "3rem", 
                padding: "24px", 
              }}
            >
              <LiveTvIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-8 p-8">
        {course && (
          <>
            <CourseDetails course={course} selectedVideo={selectedVideo} />
            <CourseSections
              course={course}
              openSection={openSection}
              toggleSection={toggleSection}
              handleVideoClick={handleVideoClick}
              tutor={{
                _id: "1",
                name: "Tutor Name",
                email: "tutor@example.com",
                phone: 1234567890,
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default CourseView;
