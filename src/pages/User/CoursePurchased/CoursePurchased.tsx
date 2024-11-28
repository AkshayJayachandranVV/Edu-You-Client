import React, { useState, useEffect } from "react";
import Navbar from "../../../components/User/Home/UserHome/Navbar/Navbar";
import CourseSections from "../../../components/User/CoursePurchased/CourseSection";
import CourseDetails from "../../../components/User/CoursePurchased/CourseView";
import axiosInstance from '../../../components/constraints/axios/userAxios';
import { userEndpoints } from "../../../components/constraints/endpoints/userEndpoints";
import { useParams } from 'react-router-dom';

interface Lesson {
  title: string;
  description: string;
  video: string;
  displayVideo: string;
}

interface Section {
  title: string;
  lessons: Lesson[];
}

interface Course {
  courseName: string;
  courseDescription: string;
  coursePrice: number;
  courseDiscountPrice: number;
  courseCategory: string;
  courseLevel: string;
  demoURL: string;
  thumbnail: string;
  thumbnailUrl: string | null;
  prerequisites: string[];
  benefits: string[];
  sections: Section[];
}

const PurchasedSingleCourse: React.FC = () => {
  const [openSection, setOpenSection] = useState<number | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [course, setCourse] = useState<Course | null>(null);

  const { courseId } = useParams<{ courseId: string }>();

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
            sections: courseData.sections.map((section: any, sectionIndex: number) => {
              console.log(sectionIndex)
              const lessonsInSection = section.lessons.map((lesson: any, lessonIndex: number) => {
                let lessonTitle = "";
                let videoUrl = "";
                let lessonDescription = "";

                if (lesson.$__parent && lesson.$__parent.lessons && lesson.$__parent.lessons.length > 0) {
                  const parentLesson = lesson.$__parent.lessons[lessonIndex];
                  lessonTitle = parentLesson?.title || "";
                  lessonDescription = parentLesson?.description || "";
                  videoUrl = parentLesson?.video || "";
                } else {
                  lessonTitle = lesson.title || "";
                  lessonDescription = lesson.description || "";
                  videoUrl = lesson.video || "";
                }

                return {
                  title: lessonTitle,
                  description: lessonDescription,
                  video: videoUrl,
                  displayVideo: lesson.displayVideo || "",
                };
              });

              return {
                title: section.title,
                lessons: lessonsInSection,
              };
            }),
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
    <div className="flex flex-col min-h-screen bg-[#0d1117]">
      <Navbar />
      <div style={{ marginTop: '70px' }} className="flex flex-col md:flex-row gap-8 p-6">
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
