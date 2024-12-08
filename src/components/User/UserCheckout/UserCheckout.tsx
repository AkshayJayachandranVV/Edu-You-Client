import { useEffect, useState } from "react";
import Navbar from "../../User/Home/UserHome/Navbar/Navbar";
import Footer from "../../User/Home/UserHome/Footer/Footer";
import bannerImage from "../../../assets/images/User/checkout.png";
import axiosInstance from "../../../components/constraints/axios/userAxios";
import { userEndpoints } from "../../../components/constraints/endpoints/userEndpoints";
import { RootState } from "../../../redux/store";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import CheckoutBanner  from './CheckoutBanner'
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
  thumbnailKey: string;
  tutorId: string;
}

interface Tutor {
  tutorname: string;
  email: string;
  phone: string;
}


export default function Checkout() {
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState<Course | null>(null);
  const [tutorDetails, setTutorDetails] = useState<Tutor | null>(null);

  useEffect(() => {
    sessionStorage.removeItem("orderCheck");

    const fetchCourseDetails = async () => {
      try {
        if (courseId) {
          const response = await axiosInstance.get(
            `${userEndpoints.courseDetails.replace("courseId", courseId)}`
          );
          setCourseData(response.data.courses);

          console.log(response.data, "hey got the thumbnailkey");

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
        console.log("reached here ", tutorId);
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
        thumbnail: courseData?.thumbnailKey, // Course thumbnail
        tutorId: courseData?.tutorId, // Tutor details
      };

      console.log(paymentData, "------------------------------");

      // Call the backend to create a Stripe session
      const result = await axiosInstance.post(
        userEndpoints.payment,
        paymentData
      );

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
      <Navbar />

      {/* Banner Section */}
      {/* Banner Section */}
      <CheckoutBanner bannerImage={bannerImage}/>

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
              <div className="bg-gray-900 rounded-lg shadow-xl p-6">
                <h3 className="text-2xl font-extrabold text-center text-yellow-400 mb-4">
                  Tutor Details
                </h3>
                {tutorDetails ? (
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-gray-800 rounded-lg p-3">
                      <p className="text-lg">
                        <span className="font-bold text-yellow-300">Name:</span>{" "}
                        {tutorDetails.tutorname}
                      </p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                      <p className="text-lg">
                        <span className="font-bold text-yellow-300">
                          Email:
                        </span>{" "}
                        {tutorDetails.email}
                      </p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                      <p className="text-lg">
                        <span className="font-bold text-yellow-300">
                          Phone:
                        </span>{" "}
                        {tutorDetails.phone}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-lg text-gray-400 text-center">
                    Loading tutor details...
                  </p>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => handlePayment(courseData._id)}
            className="bg-blue-600 text-white rounded-md px-4 py-2 mt-4 w-full hover:bg-blue-700"
          >
            Place Order
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}
