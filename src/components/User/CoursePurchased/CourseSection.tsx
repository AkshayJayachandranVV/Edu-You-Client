// CourseSections.tsx
import React from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import tutorImage from "../../../assets/images/User/UserHome/Account.png";
import CloseIcon from "@mui/icons-material/Close";
import VideoIcon from "@mui/icons-material/OndemandVideo";
import StarIcon from "@mui/icons-material/Star";

interface CourseProps {
  course?: {
    title: string;
    description: string;
    sections: {
      title: string;
      lessons: { title: string; video: string }[];
    }[];
    rating?: number;
  };
  tutor?: {
    _id: string;
    name: string;
    email: string;
    phone: number;
  };
  openSection?: number | null;
  toggleSection?: (section: number) => void;
  handleVideoClick?: (videoUrl: string) => void;
}

const CourseSections: React.FC<CourseProps> = ({
  course = {
    title: "Course Title Placeholder",
    description: "Course description placeholder text",
    sections: [
      {
        title: "Section 1",
        lessons: [
          { title: "Lesson 1", video: "Video URL placeholder" },
          { title: "Lesson 2", video: "Video URL placeholder" },
        ],
      },
      {
        title: "Section 2",
        lessons: [{ title: "Lesson 3", video: "Video URL placeholder" }],
      },
    ],
    rating: 4,
  },
  tutor = {
    _id: "1",
    name: "Tutor Name Placeholder",
    email: "tutor@example.com",
    phone: 1234567890,
  },
  openSection = null,
  toggleSection = () => {},
  handleVideoClick = () => {},
}) => {
  return (
    <div className="max-w-2xl w-full bg-[#1f2937] shadow-lg rounded-lg p-10 mt-15 text-gray-200 mx-auto"> {/* Removed fixed width */}
      <h2 className="text-2xl font-bold mb-6">{course.title}</h2>
      <p className="text-lg mb-8 text-gray-400">{course.description}</p>

      <h3 className="text-2xl font-semibold mb-6">Sections</h3>
      {course.sections.map((section, index) => (
        <div key={index} className="mb-6">
          <div
            className="flex justify-between items-center cursor-pointer p-6 bg-[#374151] rounded-md shadow-md hover:bg-[#4b5563]"
            onClick={() => toggleSection(index)}
          >
            <div className="text-xl font-medium text-gray-300">{section.title}</div>
            {openSection === index ? (
              <CloseIcon className="text-gray-400" />
            ) : (
              <ArrowDropDownIcon className="text-gray-400" />
            )}
          </div>

          {openSection === index && (
            <div className="mt-4 bg-[#111827] p-6 rounded-lg shadow-md">
              {section.lessons.map((lesson, lessonIndex) => (
                <div key={lessonIndex} className="flex justify-between items-center mb-4">
                  <p className="text-lg text-gray-300">{lesson.title}</p>
                  <VideoIcon
                    className="cursor-pointer text-2xl text-teal-400"
                    onClick={() => handleVideoClick(lesson.video)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Tutor Details Card */}
      <div className="tutorDetails mt-12 p-6 bg-[#374151] rounded-lg shadow-md flex items-center space-x-6">
        <img
          src={tutorImage}
          alt="tutorImage"
          className="w-24 h-24 rounded-full border-2 border-teal-400"
        />
        <div className="flex flex-col">
          <p className="text-2xl font-semibold text-gray-200">{tutor.name}</p>
          <div className="rating flex items-center mt-2">
            {Array.from({ length: 5 }, (_, index) => (
              <StarIcon
                key={index}
                style={{ color: index < (course.rating || 0) ? "#fbbf24" : "#4b5563" }}
              />
            ))}
            <p className="ml-3 text-lg text-gray-400">{course.rating || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseSections;
