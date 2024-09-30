import {Route,Routes} from 'react-router-dom'
import TutorLogin from "../../components/Tutor/Auth/TutorLogin/TutorLogin";
import TutorSignup from "../../components/Tutor/Auth/TutorSignup/TutorSignup";
import TutorOtp from "../../components/Tutor/Auth/TutorOtp/TutorOtp";
import TutorResetPassword from "../../components/Tutor/Auth/TutorResetPassword/TutorResetPassword";
import TutorForgotPassword from "../../components/Tutor/Auth/TutorForgotPass/TutorForgotPass";
import TutorHome from "../../pages/Tutor/TutorDashboard/TutorDashboard";
import TutorAddCourse from "../../pages/Tutor/TutorAddCourse/TutorAddCourse";
import ErrorPage from '../../components/Tutor/404/errorPage'
import PrivateRoute from "./privateRoute"
import PrivateRouteTutor from "./privateRouteTutor"


const TutorRoutes = () => {
    return(     
        <Routes>
            <Route path='/addCourse' element={ <PrivateRouteTutor> <TutorAddCourse />  </PrivateRouteTutor>} />
            <Route path='/dashboard' element={ <PrivateRouteTutor> <TutorHome />  </PrivateRouteTutor>} />
            <Route path='/login' element={ <PrivateRoute > <TutorLogin />  </PrivateRoute>} />
            <Route path='/otp' element={ <TutorOtp />} />
            <Route path='/signup' element={ <PrivateRoute > <TutorSignup />  </PrivateRoute>} />
            <Route path='/forgotPassword' element={ <PrivateRoute > <TutorForgotPassword />  </PrivateRoute>} />
            <Route path='/resetPassword' element={ <PrivateRoute ><TutorResetPassword />  </PrivateRoute>} />
            <Route path="*" element={<ErrorPage />} />
        </Routes>
    )
}

export default TutorRoutes