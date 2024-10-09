import React, { useEffect, useState } from 'react';
import Navbar from "../../User/Home/UserHome/Navbar/Navbar";
import Footer from "../../User/Home/UserHome/Footer/Footer";
import iconimage from "../../../assets/images/User/UserHome/Account.png";
import bannerImage from "../../../assets/images/User/checkout.png"; 
import axiosInstance from '../../../components/constraints/axios/userAxios';
import { userEndpoints } from "../../../components/constraints/endpoints/userEndpoints";
import { RootState } from "../../../redux/store";
import { toast } from 'sonner';
import { useDispatch,useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js'
import { useParams } from 'react-router-dom';
import { tutorEndpoints } from '../../constraints/endpoints/TutorEndpoints';

interface Course {
  _id: string;
  courseName: string;
  courseDescription: string;
  coursePrice: number;
  courseDiscountPrice?: number;
  courseCategory: string; 
  courseLevel: string;
  demoURL: string;
  thumbnail: string;
  tutorId:string
}

interface Tutor {
  tutorname: string;
  email: string;
  phone: string;
  description: string;
}

export default function Checkout() {
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState<Course | null>(null);
  const [tutorDetails, setTutorDetails] = useState<Tutor | null>(null);
  const dispatch = useDispatch()

  
  useEffect(() => {
    sessionStorage.removeItem("orderCheck");
  
    const fetchCourseDetails = async () => {
      try {
        if (courseId) {
          const response = await axiosInstance.get(
            `${userEndpoints.courseDetails.replace('courseId', courseId)}`
          );
          setCourseData(response.data.courses);
  
          // After fetching course data, fetch tutor details
          if (response.data.courses.tutorId) {
            fetchTutorDetails(response.data.courses.tutorId); // Pass tutorId here
          }
        } else {
          console.error("Course ID is undefined");
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };
  
    const fetchTutorDetails = async (tutorId: string) => {
      try {
        const response = await axiosInstance.get(
          `${userEndpoints.getTutorDetails.replace("tutorId", tutorId)}`
        );
  
        console.log(response);
        setTutorDetails(response.data);
      } catch (error) {
        console.error("Error fetching tutor details:", error);
      }
    };
  
    fetchCourseDetails();
  }, [courseId]);
  

  const userId = useSelector((state: RootState) => state.user.id);


  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

  const handlePayment = async (courseId: string) => {
    try {
      console.log("Initiating Stripe for Course:", courseId);

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe.js failed to load.");
      }

      // Use the courseData and tutorDetails to build the payment data
      const paymentData = {
        userId: userId, // User ID from Redux
        courseId: courseId, // The course ID
        courseName: courseData?.courseName, // Course name
        coursePrice: courseData?.coursePrice, // Course price
        courseDiscountPrice: courseData?.courseDiscountPrice || 0, // Optional discount price
        courseCategory: courseData?.courseCategory, // Course category
        courseLevel: courseData?.courseLevel, // Course level
        demoURL: courseData?.demoURL, // Demo video URL
        thumbnail: courseData?.thumbnail, // Course thumbnail
        tutorId: courseData?.tutorId, // Tutor details
      };

      console.log(paymentData, "------------------------------");

      // Call the backend to create a Stripe session
      const result = await axiosInstance.post(userEndpoints.payment, paymentData);

      console.log(result, "payment response");

      if (result.data.success && result.data.sessionId) {
        // Redirect the user to the Stripe checkout page
        
        const { sessionId } = result.data;
        const { error } = await stripe.redirectToCheckout({
          sessionId: sessionId,
        });

        if (error) {
          console.error("Stripe redirection failed:", error.message);
          toast.error("Failed to redirect to Stripe. Please try again.");
        }
      } else {
        throw new Error("Failed to create Stripe session");
      }
    } catch (error) {
      console.error("Error loading payment processing:", error);
      toast.error("Couldn't load payment processing. Please try again.");
    }
  };
  

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Navbar iconimage={iconimage} />

      {/* Banner Section */}
      <div className="relative bg-black p-6" style={{ minHeight: "150px" }}>
        <img
          src={bannerImage}
          alt="Banner"
          className="w-[700px] h-[400px] object-cover mb-4"
          style={{ marginLeft: "700px", marginTop: "60px" }}
        />
        <h1
          className="font-black text-white absolute"
          style={{
            top: "40%",
            left: "220px",
            transform: "translateY(-50%)",
            fontSize: "80px",
          }}
        >
          Checkout
        </h1>
      </div>

      {/* Course and Tutor Data Rendering */}
      {courseData && (
        <div className="flex-grow p-6">
          <div className="bg-gray-800 rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-4">Course Summary</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Course Summary */}
              <div className="bg-gray-700 rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

                <div className="mb-4">
                  <img 
                    src={courseData.thumbnail} 
                    alt={`${courseData.courseName} Thumbnail`} 
                    className="w-full h-auto object-cover rounded-md"
                  />
                </div>

                <div className="flex justify-between mb-2">
                  <span>{courseData.courseName}</span>
                  <span>₹ {courseData.coursePrice}</span>
                </div>

                {courseData.courseDiscountPrice && (
                  <div className="flex justify-between mb-2">
                    <span>Discount Price</span>
                    <span>₹ {courseData.courseDiscountPrice}</span>
                  </div>
                )}

                <div className="flex justify-between mb-2 font-semibold">
                  <span>Total Price</span>
                  <span>₹ {courseData.coursePrice}</span>
                </div>
              </div>

              {/* Tutor Details */}
              <div className="bg-gray-800 rounded-lg shadow-lg p-6">
  <h3 className="text-2xl font-bold text-yellow-400 mb-4">Tutor Details</h3>
  {tutorDetails ? (
    <div className="space-y-4">
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A6.027 6.027 0 0112 15a6.027 6.027 0 016.879 2.804M15 10a3 3 0 11-6 0 3 3 0 016 0zM12 12v6m0 0h2m-2 0h-2" />
        </svg>
        <p className="text-lg text-white">
          <strong className="text-yellow-400">Name:</strong> {tutorDetails.tutorname}
        </p>
      </div>
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 12h4v10H4V12h4M2 7h20M12 12v6m0 0h2m-2 0h-2" />
        </svg>
        <p className="text-lg text-white">
          <strong className="text-yellow-400">Email:</strong> {tutorDetails.email}
        </p>
      </div>
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h18M9 3h6M9 21h6m0-2v-2m0 0V7m0 10v-2m-6 2V7m0 10v-2" />
        </svg>
        <p className="text-lg text-white">
          <strong className="text-yellow-400">Phone:</strong> {tutorDetails.phone}
        </p>
      </div>
      <div className="flex items-start">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 8l7-3 7 3v10a2 2 0 01-2 2H7a2 2 0 01-2-2V8z" />
        </svg>
        <p className="text-lg text-white">
          <strong className="text-yellow-400">Description:</strong> {tutorDetails.description || 'No description available.'}
        </p>
      </div>
    </div>
  ) : (
    <p className="text-gray-400">Loading tutor details...</p>
  )}
</div>

            </div>

            <button
              onClick={() => handlePayment(courseData._id)}
              className="bg-blue-600 text-white rounded-md px-4 py-2 mt-4 w-full hover:bg-blue-700"
            >
              Place Order
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
