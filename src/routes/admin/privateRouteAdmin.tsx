import React,{ReactNode} from "react";
import { Navigate } from "react-router-dom";
 import Cookies from "js-cookie";
interface privateRouteTutorProps{
    children:ReactNode
}
const  PrivateRouteTutor:React.FC<privateRouteTutorProps>=({children})=> {
    const tutor = Cookies.get('adminRefreshToken')

  return tutor? children:<Navigate to = "/admin/"/>
}

export default PrivateRouteTutor
