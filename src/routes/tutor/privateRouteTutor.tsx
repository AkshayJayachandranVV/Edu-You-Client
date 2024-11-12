import React,{ReactNode} from "react";
import { Navigate } from "react-router-dom";
 import Cookies from "js-cookie";
interface privateRouteTutorProps{
    children:ReactNode
}
const  PrivateRouteTutor:React.FC<privateRouteTutorProps>=({children})=> {
    const tutor = Cookies.get('tutorRefreshToken')

  return tutor? children:<Navigate to = "/tutor/login"/>
}

export default PrivateRouteTutor
