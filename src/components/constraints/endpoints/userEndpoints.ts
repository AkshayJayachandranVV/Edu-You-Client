
export const API_GATEWAY_BASE_URL =import.meta.env.VITE_API_GATEWAY_USER_URL;


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
    report: `${API_GATEWAY_BASE_URL}/report`,
    fetchNotify: `${API_GATEWAY_BASE_URL}/fetchNotify`,
    updateReadStatus: `${API_GATEWAY_BASE_URL}/updateReadStatus`,
    updateReadUsers: `${API_GATEWAY_BASE_URL}/updateReadUsers`,
    fetchGroupMembers: `${API_GATEWAY_BASE_URL}/fetchGroupMembers`,
    reviewPost: `${API_GATEWAY_BASE_URL}/reviewPost`,
    fetchReview: `${API_GATEWAY_BASE_URL}/fetchReview/courseId`,
    fetchTutor: `${API_GATEWAY_BASE_URL}/fetchTutor/courseId`
}



