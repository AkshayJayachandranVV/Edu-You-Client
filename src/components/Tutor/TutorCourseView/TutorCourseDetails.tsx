import React, { useState, useEffect } from "react";
import SchoolIcon from "@mui/icons-material/School";
import StarIcon from "@mui/icons-material/Star";
import TranslateIcon from "@mui/icons-material/Translate";
import { RiCheckDoubleLine } from "react-icons/ri";

interface Lesson {
  title: string;
  displayVideo: string;
  description: string;
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

  useEffect(() => {
    if (propSelectedVideo) {
      setSelectedVideo(propSelectedVideo);
    } else if (course.sections.length > 0 && course.sections[0].lessons.length > 0) {
      setSelectedVideo(course.sections[0].lessons[0].displayVideo);
    }
  }, [course, propSelectedVideo]);

  return (
    <div className="max-w-5xl w-full bg-[#1f2937] shadow-lg rounded-lg p-8 text-gray-200">
      {/* Course Thumbnail */}
      {course.thumbnailUrl && (
        <div className="w-full mb-6">
          <img
            src={course.thumbnailUrl}
            alt={`${course.courseName} thumbnail`}
            className="w-full h-64 object-cover rounded-lg shadow-md"
          />
        </div>
      )}

      <h2 className="text-4xl font-bold text-teal-400 mb-4">{course.courseName}</h2>
      <div className="flex items-center space-x-6 text-lg mb-6">
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

      <div className="relative w-full mt-6 mb-6">
        {selectedVideo ? (
          <video className="w-full rounded-lg shadow-lg" controls src={selectedVideo}>
            Your browser does not support the video tag.
          </video>
        ) : (
          <p className="text-gray-400">No video selected.</p>
        )}
      </div>

      <div className="bg-[#111827] p-6 mt-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-2">Description</h3>
        <p>{course.courseDescription}</p>
      </div>

      <div className="bg-[#111827] p-6 mt-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-2">Benefits</h3>
        <ul className="list-disc list-inside space-y-1">
          {course.benefits.map((benefit, index) => (
            <li key={index} className="text-gray-300">
              <RiCheckDoubleLine className="text-blue-500 mr-2 inline" />
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-[#111827] p-6 mt-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-2">Prerequisites</h3>
        <ul className="list-disc list-inside space-y-1">
          {course.prerequisites.map((prerequisite, index) => (
            <li key={index} className="text-gray-300">
              <RiCheckDoubleLine className="text-blue-500 mr-2 inline" />
              {prerequisite}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CourseDetails;
