import {Route,Routes} from 'react-router-dom'
import UserLogin from "../../src/components/User/Auth/UserLogin/UserLogin";
import UserSignup from "../../src/components/User/Auth/UserSignup/UserSignup";
import UserOtp from "../../src/components/User/Auth/UserOtp/UserOtp";
import UserForgotPassword from "../../src/components/User/Auth/UserForgotPass/UserForgotPass";
import ResetPassword from "../../src/components/User/Auth/ResetPassword/ResetPassword";
import UserHome from "../../src/components/User/Home/UserHome/UserHome";


const UserRoutes = () => {
    return(
        <Routes>
            <Route path='/' element={ <UserHome />} />
            <Route path='/login' element={ <UserLogin />} />
            <Route path='/otp' element={ <UserOtp />} />
            <Route path='/signup' element={ <UserSignup />} />
            <Route path='/forgotPassword' element={ <UserForgotPassword />} />
            <Route path='/resetPassword' element={ <ResetPassword />} />
        </Routes>
    )
}

export default UserRoutes
