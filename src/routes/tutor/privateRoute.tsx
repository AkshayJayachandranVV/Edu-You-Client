import React,{ReactNode} from 'react';
import Cookies from 'js-cookie'
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps{
  children:ReactNode
}

const PrivateRoute: React.FC<PrivateRouteProps>=({children})=> {
const tutor = Cookies.get('tutorRefreshToken')

  return  tutor? <Navigate to='/tutor/dashboard'/>:<>{children}</>
}
export default PrivateRoute;