import React from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import tutorImage from "../../../assets/images/User/UserHome/Account.png";
// import CloseIcon from "@mui/icons-material/Close";
import VideoIcon from "@mui/icons-material/OndemandVideo";
// import StarIcon from "@mui/icons-material/Star";

interface CourseProps {
  course?: {
    courseName: string;
    courseDescription: string;
    sections: {
      title: string;
      lessons: { title: string; displayVideo: string }[];
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
  course,
  openSection,
  toggleSection,
  handleVideoClick,
  tutor,
}) => {
  return (
    <div className="max-w-2xl w-full bg-[#1f2937] shadow-lg rounded-lg p-8 mt-8 text-gray-200">
      <h2 className="text-2xl font-bold mb-6">{course?.courseName}</h2>
      <p className="text-lg mb-8 text-gray-400">{course?.courseDescription}</p>

      <h3 className="text-2xl font-semibold mb-6">Sections</h3>
      {course?.sections.map((section, index) => (
        <div key={index} className="bg-[#111827] rounded-lg p-4 mb-4">
          <div
            onClick={() => toggleSection && toggleSection(index)}
            className="flex items-center justify-between cursor-pointer mb-4"
          >
            <h3 className="text-xl font-semibold">{section.title}</h3>
            <ArrowDropDownIcon
              className={`transition-transform ${
                openSection === index ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>
          {openSection === index &&
            section.lessons.map((lesson, idx) => (
              <div
                key={idx}
                onClick={() => handleVideoClick && handleVideoClick(lesson.displayVideo)}
                className="flex items-center text-gray-300 hover:text-teal-400 cursor-pointer p-2 rounded-lg mb-2 transition-all duration-300"
              >
                <VideoIcon className="mr-2" />
                <p>{lesson.title}</p>
              </div>
            ))}
        </div>
      ))}

      <div className="bg-[#111827] rounded-lg p-6 mt-8">
        <div className="flex items-center space-x-4 mb-4">
          <img src={tutorImage} alt="Tutor" className="h-16 w-16 rounded-full" />
          <div>
            <h3 className="text-lg font-bold">{tutor?.name}</h3>
            <p>{tutor?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseSections;
