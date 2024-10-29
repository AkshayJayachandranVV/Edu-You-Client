
export const API_GATEWAY_BASE_URL ='http://localhost:4000';


export const userEndpoints = {
    register : `${API_GATEWAY_BASE_URL}/register`,
    otp : `${API_GATEWAY_BASE_URL}/verifyOtp`,
    resendOtp : `${API_GATEWAY_BASE_URL}/resendOtp`,
    login : `${API_GATEWAY_BASE_URL}/login`,
    forgotPasword : `${API_GATEWAY_BASE_URL}/forgotPassword`,
    resetPassword: `${API_GATEWAY_BASE_URL}/resetPassword`,
    googleLogin: `${API_GATEWAY_BASE_URL}/google_login`,
    forgotOtpVerify: `${API_GATEWAY_BASE_URL}/forgotOtpVerify`,
    profile: `${API_GATEWAY_BASE_URL}/profile`,
    courseDetails: `${API_GATEWAY_BASE_URL}/courseDetails/courseId`,
    allCourses: `${API_GATEWAY_BASE_URL}/allCourses`,
    payment: `${API_GATEWAY_BASE_URL}/payment`,
    orderSuccess: `${API_GATEWAY_BASE_URL}/orderSuccess`,
    getTutorDetails: `${API_GATEWAY_BASE_URL}/getTutorDetails/tutorId`,
    getUserCourses :  `${API_GATEWAY_BASE_URL}/getCourses/userId`,
    fetchChat: `${API_GATEWAY_BASE_URL}/fetchChat`,
    sendFile: `${API_GATEWAY_BASE_URL}/sendFile`,
    myCourse: `${API_GATEWAY_BASE_URL}/myCourse/userId`,
    courseView: `${API_GATEWAY_BASE_URL}/courseView/courseId`,
}

