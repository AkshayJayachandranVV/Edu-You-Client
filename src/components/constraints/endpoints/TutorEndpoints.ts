export const API_GATEWAY_BASE_URL ='http://localhost:4000/tutor';


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
}

