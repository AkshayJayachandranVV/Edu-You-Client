import "./UserHome.css";
import Navbar from "../../Home/UserHome/Navbar/Navbar";
import Footer from "../../Home/UserHome/Footer/Footer";
import iconimage from "../../../../assets/images/User/UserHome/Account.png";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { logout } from "../../../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { courseEndpoints } from "../../../constraints/endpoints/courseEndpoints";
import { tutorEndpoints } from "../../../constraints/endpoints/TutorEndpoints";
import axios from "axios";
import { Link } from "react-router-dom";
import { ContactPageSharp } from "@mui/icons-material";
import {fetchNewSignedUrl} from '../../../../S3signedUrl/fetchNewSignedUrl';


interface Course {
  _id: string; // or number, depending on your implementation
  thumbnail: string; // the original thumbnail key
  thumbnailUrl?: string; // the new signed URL (optional)
  courseName: string;
  courseDescription:string;
  coursePrice:string;
}

export default function UserHome() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]); // Explicitly typing the courses state
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});
  

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

  // const fetchData = async () => {
  //   try {
  //     const result = await axios.get(courseEndpoints.userCourse);
  //     console.log(result.data.courses,"--------------------------")
  //     setCourses(result.data.courses); // store fetched courses in state
  //     console.log(result.data.courses);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };


  const fetchData = async () => {
    try {
      const result = await axios.get(courseEndpoints.userCourse);
      setCourses(result.data.courses); // Store fetched courses in state
  
      console.log(result.data.courses);
  
      // Generate signed URLs for each course's thumbnail
      const initialUrls = await result.data.courses.reduce(async (accPromise, course) => {
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
  
  

  const logOut = () => {
    dispatch(logout());
    navigate("/login");
    localStorage.setItem("userAccessToken", "");
    Cookies.remove("userAccessToken");
  };

  const handleProfileClick = () => {
    navigate("/profile"); // Navigate to the /profile route
  };


  // const handleImageError = async (imageFilename: string) => {
  //   try {
  //     const response = await axios.post('http://localhost:4000/tutor/getSignedUrlId', { imageKey: imageFilename });
  //     console.log(response.data, "--------------------url");

  //     setCourses((prevCourses) =>
  //       prevCourses.map((course) =>
  //         course.thumbnail === imageFilename ? { ...course, thumbnailUrl: response.data } : course // Replace the old URL
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Error fetching new signed URL:", error);
  //   }
  // };
  

  return (
    <div className="user-home">
      <Navbar
        iconimage={iconimage}
        logOut={logOut}
        handleProfileClick={handleProfileClick}
      />

      <div className="container-16">
        <div className="container-18">
          <div className="discoverthe-professions-of-the-future">
            Discover
            <br />
            the professions
            <br />
            of the future
          </div>
          <div className="lorem-ipsum-dolor-sit-amet-consectetur-adipiscing-elit-phasellus-imperdiet-nulla-et-dictum-interdum-nisi-lorem-egestas-odio-vitae-scelerisque-enim-ligula-venenatis-dolor-maecenas-nisl-est-ultrices-nec-congue-eget-auctor-vitae-massa">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            <br />
            Phasellus imperdiet, nulla et dictum interdum, <br />
            nisi lorem egestas odio, vitae scelerisque enim ligula venenatis
            dolor.
            <br />
            Maecenas nisl est, ultrices nec congue eget, auctor vitae massa.
          </div>
          <button onClick={allCourse} className="get-started">Get Started</button>
        </div>
        <div className="user-home-1"></div>
      </div>

      {/* Top Courses Section */}
      <div className="top-courses">
        <div className="featured-courses">Featured Courses</div>
        <div className="cards">
      {/* Map over courses and display them in cards */}
      {courses.length > 0 ? (
        courses.map((course, index) => (
          <div 
            key={index} 
            className="card" 
            onClick={() => handleCardClick(course._id)} // Call the function with the course ID
          >
            <img  src={course.thumbnailUrl} alt={course.courseName} className="card-image" />
            <h3 className="card-title">{course.courseName}</h3>
            <p className="card-description">{course.courseDescription}</p>
            <p className="card-amount">Rs. {course.coursePrice}</p>
          </div>
        ))
      ) : (
        <p>No courses available at the moment.</p>
      )}
    </div>
      </div>

      <div className="container-12">
        <div className="rectangle-251"></div>
        <div className="container-22">
          <div className="about-us">About Us</div>
          <div className="lorem-ipsum-has-been-the-industrys-standard-dummy-text-ever-since-the-1500-swhen-an-unknown-printer-took-agalley-of-type-and-scrambled-it-to-make-atype-specimen-book-versions-of-the-lorem-ipsum-text-have-been-used-in-typesetting-at-least-since-the-1960-swhen-it-was-popularized-by-advertisements-for-letraset-transfer-sheets-lorem-ipsum-was-introduced-to-templates-for-its-desktop-publishing-program-page-maker-as-have-many-la-te-xpackages-web-content-managers-such-as-joomla-and-word-press-and-css-libraries">
            <br />
            Lorem Ipsum has been the industry&#39;s standard dummy text
            <br />
            ever since the 1500s,when an unknown printer took a galley
            <br />
            of type and scrambled it to make a type specimen book. <br />
            Versions of the Lorem ipsum text have been used in typesetting
            <br />
            at least since the 1960s,when it was popularized by advertisements
            for <br />
            Letraset transfer sheets. Lorem ipsum was introduced to templates
            for its desktop
            <br />
            publishing program PageMaker. as have many LaTeX
            <br />
            packages, web content managers such as Joomla! and WordPress, and
            CSS libraries.
          </div>
          <div className="container-21">
            <span className="get-started-1">Get Started</span>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
