import { Route, Routes, useLocation } from 'react-router-dom';
import UserLogin from "../../components/User/Auth/UserLogin/UserLogin";
import UserSignup from "../../components/User/Auth/UserSignup/UserSignup";
import UserOtp from "../../components/User/Auth/UserOtp/UserOtp";
import UserForgotPassword from "../../components/User/Auth/UserForgotPass/UserForgotPass";
import ResetPassword from "../../components/User/Auth/ResetPassword/ResetPassword";
import UserHome from "../../components/User/Home/UserHome/UserHome";
import UserProfile from "../../components/User/UserProfile/UserProfile";
import UserCourseDetails from "../../pages/User/CourseDetails/CourseDetails";
import UserAllCourses from "../../components/User/UserAllCourses/UserAllCourses";
import UserCheckout from "../../components/User/UserCheckout/UserCheckout";
import PaymentSuccess from "../../components/User/PaymentSuccess/PaymentSuccess";
import MyCourse from "../../components/User/MyCourse/MyCourse";
import CourseView from "../../pages/User/CoursePurchased/CoursePurchased";
import ErrorPage from '../../components/User/404/errorPage'; 
import Chat from "../../pages/User/UserChat/UserChat";
import LiveStream from "../../pages/User/UserLiveStreaming/UserLiveStreaming";
import LandingPage from "../../pages/LandingPage/LandingPage";
import SelectRole from "../../pages/LandingPage/SelectRole";
import PrivateRoute from "./privateRoute";
import PrivateRouteUser from "./privateRouteUser";
import ChatBotIcon from "../../components/ChatBot/ChatBotIcon";
import Cookies from "js-cookie";

const UserRoutes = () => {
  const userId = Cookies.get('userId');
  const location = useLocation();

  // Specify paths where the ChatBotIcon should not appear
  const excludeChatBotPaths = [
    '/chat',
  ];

  // Check if current path is in the exclude list
  const shouldShowChatBot = userId && !excludeChatBotPaths.some((path) =>
    location.pathname.startsWith(path.split(':')[0]) // Handle dynamic params
  );

  return (
    <>
      <Routes>
        <Route path='/' element={<PrivateRoute><LandingPage /></PrivateRoute>} />
        <Route path='/selectRole' element={<PrivateRoute><SelectRole /></PrivateRoute>} />
        <Route path='/home' element={<PrivateRouteUser><UserHome /></PrivateRouteUser>} />
        <Route path='/login' element={<PrivateRoute><UserLogin /></PrivateRoute>} />
        <Route path='/otp' element={<PrivateRoute><UserOtp /></PrivateRoute>} />
        <Route path='/signup' element={<PrivateRoute><UserSignup /></PrivateRoute>} />
        <Route path='/forgotPassword' element={<PrivateRoute><UserForgotPassword /></PrivateRoute>} />
        <Route path='/resetPassword' element={<PrivateRoute><ResetPassword /></PrivateRoute>} />
        <Route path='/profile' element={<PrivateRouteUser><UserProfile /></PrivateRouteUser>} />
        <Route path='/courseDetails/:courseId' element={<PrivateRouteUser><UserCourseDetails /></PrivateRouteUser>} />
        <Route path='/allCourses' element={<PrivateRouteUser><UserAllCourses /></PrivateRouteUser>} />
        <Route path='/checkout/:courseId' element={<PrivateRouteUser><UserCheckout /></PrivateRouteUser>} />
        <Route path='/success' element={<PrivateRouteUser><PaymentSuccess /></PrivateRouteUser>} />
        <Route path='/myCourses' element={<PrivateRouteUser><MyCourse /></PrivateRouteUser>} />
        <Route path='/courseView/:courseId' element={<PrivateRouteUser><CourseView /></PrivateRouteUser>} />
        <Route path='/chat' element={<PrivateRouteUser><Chat /></PrivateRouteUser>} />
        <Route path='/goLive/:courseId' element={<PrivateRouteUser><LiveStream /></PrivateRouteUser>} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      {shouldShowChatBot && <ChatBotIcon />}
    </>
  );
};

export default UserRoutes;
