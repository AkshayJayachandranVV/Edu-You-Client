import React, { useState, useEffect } from "react";
import SchoolIcon from "@mui/icons-material/School";
import StarIcon from "@mui/icons-material/Star";
import TranslateIcon from "@mui/icons-material/Translate";
import { RiCheckDoubleLine } from "react-icons/ri";

interface Lesson {
  title: string;
  displayVideo: string;
  description: string; // Assuming you have a description for lessons
}

interface Section {
  title: string;
  lessons: Lesson[];
}

interface CourseProps {
  course: {
    courseName: string;
    courseDescription: string;
    courseCategory: string;
    courseLevel: string;
    coursePrice: number;
    courseDiscountPrice: number;
    demoURL: string;
    thumbnailUrl: string;
    courseRating?: number;
    courseEnrolled?: number;
    courseLanguage?: string;
    benefits: string[];
    prerequisites: string[];
    sections: Section[];
  };
  selectedVideo: string | null;
}

const CourseDetails: React.FC<CourseProps> = ({ course, selectedVideo: propSelectedVideo }) => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  // Set selected video from props or initialize with the first lesson's video
  useEffect(() => {
    if (propSelectedVideo) {
      setSelectedVideo(propSelectedVideo);
    } else if (course.sections.length > 0 && course.sections[0].lessons.length > 0) {
      setSelectedVideo(course.sections[0].lessons[0].displayVideo);
    }
  }, [course, propSelectedVideo]);

  return (
    <div className="max-w-5xl w-full bg-[#1f2937] shadow-xl rounded-lg p-6 text-gray-200">
      <h2 className="text-5xl font-bold text-teal-400">{course.courseName}</h2>
      <div className="flex items-center space-x-8 mt-4">
        <div className="flex items-center space-x-2">
          <StarIcon className="text-amber-400" />
          <p>{course.courseRating || "N/A"} Rating</p>
        </div>
        <div className="flex items-center space-x-2">
          <SchoolIcon className="text-violet-800" />
          <p>{course.courseEnrolled || 0} Enrolled</p>
        </div>
        <div className="flex items-center space-x-2">
          <TranslateIcon className="text-pink-500" />
          <p>{course.courseLanguage || "N/A"}</p>
        </div>
      </div>

      {/* Video Section */}
      <div className="relative w-full mt-6">
        {selectedVideo ? (
          <video className="w-full rounded-lg shadow-lg" controls src={selectedVideo}>
            Your browser does not support the video tag.
          </video>
        ) : (
          <img src={course.thumbnailUrl} alt={`${course.courseName} thumbnail`} className="w-full rounded-lg shadow-lg" />
        )}
      </div>

      {/* Course Description */}
      <div className="bg-[#111827] p-4 mt-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-2">Description</h3>
        <p>{course.courseDescription}</p>
      </div>

      {/* Benefits Section */}
      <div className="bg-[#111827] p-4 mt-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-2">Benefits</h3>
        <ul>
          {course.benefits.map((benefit, index) => (
            <li key={index} className="flex items-center text-gray-300">
              <RiCheckDoubleLine className="text-blue-500 mr-2" />
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      {/* Prerequisites Section */}
      <div className="bg-[#111827] p-4 mt-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-2">Prerequisites</h3>
        <ul>
          {course.prerequisites.map((prerequisite, index) => (
            <li key={index} className="flex items-center text-gray-300">
              <RiCheckDoubleLine className="text-blue-500 mr-2" />
              {prerequisite}
            </li>
          ))}
        </ul>
      </div>

      {/* Course Sections */}
      <div className="bg-[#111827] p-4 mt-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-2">Course Sections</h3>
        {course.sections.map((section, index) => (
          <div key={index} className="mt-4">
            <h4 className="text-xl text-teal-300">{section.title}</h4>
            <ul className="space-y-2">
              {section.lessons.map((lesson, lessonIndex) => (
                <li key={lessonIndex} className="flex items-center text-gray-300">
                  <button
                    onClick={() => setSelectedVideo(lesson.displayVideo)}
                    className="text-teal-400 hover:underline mr-2"
                  >
                    {lesson.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseDetails;
