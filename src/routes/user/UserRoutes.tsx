import {Route,Routes} from 'react-router-dom'
import UserLogin from "../../components/User/Auth/UserLogin/UserLogin";
import UserSignup from "../../components/User/Auth/UserSignup/UserSignup";
import UserOtp from "../../components/User/Auth/UserOtp/UserOtp";
import UserForgotPassword from "../../components/User/Auth/UserForgotPass/UserForgotPass";
import ResetPassword from "../../components/User/Auth/ResetPassword/ResetPassword";
import UserHome from "../../components/User/Home/UserHome/UserHome";
import UserProfile  from "../../components/User/UserProfile/UserProfile";
import UserCourseDetails from "../../components/User/UserCourseDetails/UserCourseDetails";
import UserAllCourses from "../../components/User/UserAllCourses/UserAllCourses";
import UserCheckout from "../../components/User/UserCheckout/UserCheckout";
import PaymentSuccess from "../../components/User/PaymentSuccess/PaymentSuccess";
import MyCourse from "../../components/User/MyCourse/MyCourse";
import ErrorPage from '../../components/User/404/errorPage'; 
import Chat from "../../pages/User/UserChat/UserChat";
import PrivateRoute from "./privateRoute"
import PrivateRouteUser from "./privateRouteUser"


const UserRoutes = () => {
    return(
        <Routes>
            <Route path='/' element={ <PrivateRouteUser><UserHome /> </PrivateRouteUser> } />
            <Route path='/login' element={ <PrivateRoute > <UserLogin />  </PrivateRoute>} />
            <Route path='/otp' element={ <PrivateRoute > <UserOtp /> </PrivateRoute>} />
            <Route path='/signup' element={<PrivateRoute ><UserSignup />  </PrivateRoute> } />
            <Route path='/forgotPassword' element={ <PrivateRoute > <UserForgotPassword />  </PrivateRoute>} />
            <Route path='/resetPassword' element={ <PrivateRoute > <ResetPassword />  </PrivateRoute>} />
            <Route path='/profile' element={ <PrivateRouteUser> <UserProfile  />  </PrivateRouteUser>} />
            <Route path='/courseDetails/:courseId' element={ <PrivateRouteUser> <UserCourseDetails />  </PrivateRouteUser>} />
            <Route path='/allCourses' element={ <PrivateRouteUser> <UserAllCourses />  </PrivateRouteUser>} />
            <Route path='/checkout/:courseId' element={ <PrivateRouteUser> <UserCheckout />  </PrivateRouteUser>} />
            <Route path='/success' element={ <PrivateRouteUser> <PaymentSuccess />  </PrivateRouteUser>} />
            <Route path='/myCourses' element={ <PrivateRouteUser> <MyCourse />  </PrivateRouteUser>} />
            <Route path='/chat' element={ <PrivateRouteUser> <Chat />  </PrivateRouteUser>} />
            <Route path="*" element={<ErrorPage />} />
        </Routes>
    )
}

export default UserRoutes
