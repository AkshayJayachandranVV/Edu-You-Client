export const API_GATEWAY_BASE_URL =import.meta.env.VITE_API_GATEWAY_TUTOR_URL;


export const tutorEndpoints = {
    register : `${API_GATEWAY_BASE_URL}/register`,
    otp : `${API_GATEWAY_BASE_URL}/verifyOtp`,
    resendOtp : `${API_GATEWAY_BASE_URL}/resendOtp`,
    login : `${API_GATEWAY_BASE_URL}/login`,
    forgotPasword : `${API_GATEWAY_BASE_URL}/forgotPassword`,
    resetPassword: `${API_GATEWAY_BASE_URL}/resetPassword`,
    googleLogin: `${API_GATEWAY_BASE_URL}/google_login`,
    forgotOtpVerify: `${API_GATEWAY_BASE_URL}/forgotOtpVerify`,
    getPresignedUrlForUpload: `${API_GATEWAY_BASE_URL}/getPresignedUrlForUpload`,
    getSignedUrl:  `${API_GATEWAY_BASE_URL}/getSignedUrlId`,
    myCourses: `${API_GATEWAY_BASE_URL}/myCourses`,
    listCourse: `${API_GATEWAY_BASE_URL}/listCourse`,
    fetchEditCourse: `${API_GATEWAY_BASE_URL}/fetchEditCourse/courseId`,
    editProfile: `${API_GATEWAY_BASE_URL}/editProfile`,
    getTutorDetails: `${API_GATEWAY_BASE_URL}/getTutorDetails/tutorId`,
    getSignedUrlId:  `${API_GATEWAY_BASE_URL}/getSignedUrlId`,
    payouts: `${API_GATEWAY_BASE_URL}/payouts`,  
    courseStudents : `${API_GATEWAY_BASE_URL}/courseStudents/courseId`,
    getPresignedUrl: `${API_GATEWAY_BASE_URL}/getPresignedUrl`,
    cardsData: `${API_GATEWAY_BASE_URL}/cardsData/tutorId`,
    graphData: `${API_GATEWAY_BASE_URL}/graphData/tutorId`,
    courseView: `${API_GATEWAY_BASE_URL}/courseView/courseId`,
    getTutorCourses :  `${API_GATEWAY_BASE_URL}/getTutorCourses/userId`,    
    addInformation :  `${API_GATEWAY_BASE_URL}/addInformation`,
    profileDetails : `${API_GATEWAY_BASE_URL}/profileDetails/tutorId`,
    listUnlist: `${API_GATEWAY_BASE_URL}/listUnlist/courseId`,
}
    

  