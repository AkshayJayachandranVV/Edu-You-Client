import {Route,Routes} from 'react-router-dom'
import TutorLogin from "../../src/components/Tutor/Auth/TutorLogin/TutorLogin";
import TutorSignup from "../../src/components/Tutor/Auth/TutorSignup/TutorSignup";
import TutorOtp from "../../src/components/Tutor/Auth/TutorOtp/TutorOtp";
import TutorResetPassword from "../../src/components/Tutor/Auth/TutorResetPassword/TutorResetPassword";
import TutorForgotPassword from "../../src/components/Tutor/Auth/TutorForgotPass/TutorForgotPass";
import TutorHome from "../../src/pages/Tutor/TutorAddCourse/TutorAddCourse";
import TutorAddCourse from "../../src/pages/Tutor/TutorAddCourse/TutorAddCourse";


const TutorRoutes = () => {
    return(
        <Routes>
            <Route path='/addCourse' element={ <TutorAddCourse />} />
            <Route path='/dashboard' element={ <TutorHome />} />
            <Route path='/login' element={ <TutorLogin />} />
            <Route path='/otp' element={ <TutorOtp />} />
            <Route path='/signup' element={ <TutorSignup />} />
            <Route path='/forgotPassword' element={ <TutorForgotPassword />} />
            <Route path='/resetPassword' element={ <TutorResetPassword />} />
        </Routes>
    )
}

export default TutorRoutes