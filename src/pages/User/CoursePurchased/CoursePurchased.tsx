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
  const [course, setCourse] = useState<any>(null); // Use 'any' type initially
  const [lessonsData, setLessonsData] = useState([]); // State to hold course data

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

        if (response.data.courses) {
          const courseData = response.data.courses;

          setCourse({
            courseName: courseData.courseName,
            courseDescription: courseData.courseDescription,
            coursePrice: courseData.coursePrice,
            courseDiscountPrice: courseData.courseDiscountPrice,
            courseCategory: courseData.courseCategory,
            courseLevel: courseData.courseLevel,
            demoURL: courseData.demoURL,
            thumbnail: courseData.thumbnail,
            thumbnailUrl: courseData.thumbnailUrl || null,
            prerequisites: courseData.prerequisites || [],
            benefits: courseData.benefits || [],
            sections: courseData.sections.map((section, sectionIndex) => {
              // Prepare to hold the lessons data for the current section
              const lessonsInSection = section.lessons.map((lesson, lessonIndex) => {
                console.log(lesson, "eachhhhhhhhhhhhhhhhhhhhhhhhh lessson--------------");

                // Extract the necessary data from the lesson.$__parent.lessons array
                let lessonTitle = "";
                let videoUrl = "";
                let lessonDescription = "";

                if (lesson.$__parent && lesson.$__parent.lessons && lesson.$__parent.lessons.length > 0) {
                  const parentLesson = lesson.$__parent.lessons[lessonIndex]; // Ensure you're accessing the correct lesson
                  lessonTitle = parentLesson?.title || ""; // Fallback to empty string
                  lessonDescription = parentLesson?.description || ""; // Fallback to empty string
                  videoUrl = parentLesson?.video || ""; // Fallback to empty string
                } else {
                  // Fallback to properties directly from the lesson object if $__parent is not available
                  lessonTitle = lesson.title || "";
                  lessonDescription = lesson.description || "";
                  videoUrl = lesson.video || "";
                }

                // Return the lesson object
                return {
                  title: lessonTitle, // Ensure a string
                  description: lessonDescription, // Ensure a string
                  video: videoUrl, // Ensure a string (no null or undefined)
                  displayVideo: lesson.displayVideo || "", // Ensure a string
                };
              });

              // Return the section object with its lessons
              return {
                title: section.title,
                lessons: lessonsInSection,
              };
            }),
          });

          // Optionally, you can also set lessons data in a separate state if needed
          setLessonsData(courseData.sections.flatMap(section => section.lessons));
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
    console.log(videoUrl, "its clickedddddddddddddddddddddddddddd");
    setSelectedVideo(videoUrl);
  };


  return (
    <div className="flex flex-col min-h-screen bg-[#0d1117]">
      <Navbar iconimage={iconimage} />
      <div style={{ marginTop: '70px' }} className="flex flex-col md:flex-row gap-8 p-6">
        {/* Conditionally render components only when course data is available */}
        {course && (
          <>
             <CourseDetails course={course} selectedVideo={selectedVideo} />
            <CourseSections
              course={course}
              openSection={openSection}
              toggleSection={toggleSection}
              handleVideoClick={handleVideoClick}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default PurchasedSingleCourse;
