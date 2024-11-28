export const API_GATEWAY_BASE_URL =import.meta.env.VITE_API_GATEWAY_COURSE_URL;


export const courseEndpoints = {
    uploadCourse : `${API_GATEWAY_BASE_URL}/uploadCourse`,
    editCourse : `${API_GATEWAY_BASE_URL}/editCourse`,
    userCourse : `${API_GATEWAY_BASE_URL}/userCourse`,
}

