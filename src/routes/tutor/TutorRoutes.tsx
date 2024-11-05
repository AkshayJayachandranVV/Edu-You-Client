import {Route,Routes} from 'react-router-dom'
import TutorLogin from "../../components/Tutor/Auth/TutorLogin/TutorLogin";
import TutorSignup from "../../components/Tutor/Auth/TutorSignup/TutorSignup";
import TutorOtp from "../../components/Tutor/Auth/TutorOtp/TutorOtp";
import TutorResetPassword from "../../components/Tutor/Auth/TutorResetPassword/TutorResetPassword";
import TutorForgotPassword from "../../components/Tutor/Auth/TutorForgotPass/TutorForgotPass";
import TutorDashboard from "../../pages/Tutor/TutorDashboard/TutorDashboard";
import TutorAddCourse from "../../pages/Tutor/TutorAddCourse/TutorAddCourse";
import TutorEditCourse from "../../pages/Tutor/TutorEditCourse/TutorEditCourse";
import TutorCourses from "../../pages/Tutor/TutorCourses/TutorCourses";
import TutorPayouts from "../../pages/Tutor/TutorPayouts/TutorPayouts";
import TutorStudents from "../../pages/Tutor/TutorStudents/TutorStudents";
import TutorProfile from "../../components/Tutor/TutorProfile/TutorProfile";
import TutorEditProfile from "../../components/Tutor/TutorEditProfile/TutorEditProfile";
import ErrorPage from '../../components/Tutor/404/errorPage'
import PrivateRoute from "./privateRoute"
import PrivateRouteTutor from "./privateRouteTutor"


const TutorRoutes = () => {
    return(     
        <Routes>
            <Route path='/editProfile' element={ <PrivateRouteTutor> <TutorEditProfile />  </PrivateRouteTutor>} />
            <Route path='/profile' element={ <PrivateRouteTutor> <TutorProfile />  </PrivateRouteTutor>} />
            <Route path='/courses' element={ <PrivateRouteTutor> <TutorCourses />  </PrivateRouteTutor>} />
            <Route path='/students' element={ <PrivateRouteTutor> <TutorStudents />  </PrivateRouteTutor>} />
            <Route path='/payouts' element={ <PrivateRouteTutor> <TutorPayouts />  </PrivateRouteTutor>} />
            <Route path='/editCourse/:courseId' element={ <PrivateRouteTutor> <TutorEditCourse />  </PrivateRouteTutor>} />
            <Route path='/addCourse' element={ <PrivateRouteTutor> <TutorAddCourse />  </PrivateRouteTutor>} />
            <Route path='/dashboard' element={ <PrivateRouteTutor> <TutorDashboard />  </PrivateRouteTutor>} />
            <Route path='/login' element={ <PrivateRoute > <TutorLogin />  </PrivateRoute>} />
            <Route path='/otp' element={ <PrivateRoute >  <TutorOtp /> </PrivateRoute>} />
            <Route path='/signup' element={ <PrivateRoute > <TutorSignup />  </PrivateRoute>} />
            <Route path='/forgotPassword' element={ <PrivateRoute > <TutorForgotPassword />  </PrivateRoute>} />
            <Route path='/resetPassword' element={ <PrivateRoute ><TutorResetPassword />  </PrivateRoute>} />
            <Route path="*" element={<ErrorPage />} />
        </Routes>
    )
}

export default TutorRoutes