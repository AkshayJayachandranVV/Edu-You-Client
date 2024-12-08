import React,{useEffect} from 'react';
import successImg from '@/assets/images/User/successPayment.jpeg'
import axiosInstance from '../../../components/constraints/axios/userAxios';
import { userEndpoints } from "../../../components/constraints/endpoints/userEndpoints";
   

const PaymentSuccess: React.FC = () => {


  // Extract the session_id from the URL query params
  const sessionId = new URLSearchParams(location.search).get('session_id');

useEffect(() => {
  const successOrder = async (sessionId: string | null) => {
    if (!sessionId) {
      return;
    }

    // Check the orderCheck value from sessionStorage
    const storedOrderCheck = sessionStorage.getItem("orderCheck");

    if (storedOrderCheck && JSON.parse(storedOrderCheck) === true) {
      // If orderCheck is true, skip calling successOrder
      console.log("Order already processed. Skipping API call.");
      return;
    }

    try {
      const response = await axiosInstance.post(userEndpoints.orderSuccess, { sessionId });

      console.log(response, "----------------------------------------------------------------");

      // Store the order success state in sessionStorage
      sessionStorage.setItem("orderCheck", JSON.stringify(response.data.success));

    } catch (err) {
      console.error("Error retrieving session:", err);
    }
  };

  successOrder(sessionId);
}, [sessionId]);




    // const orderData = useSelector((state: RootState) => state.order);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      {/* Animated checkmark icon */}
      <div className="flex flex-col items-center">
        <div className="bg-green-500 rounded-full p-4 animate-bounce">
          <svg className="w-16 h-16 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mt-4 animate-fade-in">Payment Successful!</h1>
        <p className="text-gray-400 mt-2 animate-fade-in">Thank you for purchasing the course.</p>
      </div>

      {/* Success Message */}
      <div className="flex flex-col items-center mt-8 space-y-4">
  <img
    src={successImg}
    alt="Success"
    className="w-72 h-72 rounded-lg shadow-lg transition-transform transform hover:scale-105" // w-72 = 18rem (300px), h-72 = 18rem (300px)
  />
  <p className="text-lg text-center">Your payment has been received and the course is now available in your profile.</p>
</div>


      {/* Animated Button */}
      <div className="mt-8">
        <a href="/myCourses" className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded-full shadow-md hover:bg-yellow-600 transition duration-300 transform hover:scale-105">
          Go to My Courses
        </a>
      </div>
    </div>
  );
};

export default PaymentSuccess;
