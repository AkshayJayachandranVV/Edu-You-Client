
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
}

