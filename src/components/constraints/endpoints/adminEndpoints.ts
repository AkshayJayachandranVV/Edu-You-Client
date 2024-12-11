export const API_GATEWAY_BASE_URL =import.meta.env.VITE_API_GATEWAY_BASE_URL;


export const adminEndpoints = {
    login : `${API_GATEWAY_BASE_URL}/login`,
    students : `${API_GATEWAY_BASE_URL}/students`,
    isBlocked : `${API_GATEWAY_BASE_URL}/isBlocked`,
    tutors : `${API_GATEWAY_BASE_URL}/tutors`,
    tutorIsBlocked : `${API_GATEWAY_BASE_URL}/tutorIsBlocked`,
    courses : `${API_GATEWAY_BASE_URL}/courses`,
    listCourse : `${API_GATEWAY_BASE_URL}/listCourse`,
    reportCourses: `${API_GATEWAY_BASE_URL}/reportCourses`,
    payouts: `${API_GATEWAY_BASE_URL}/payouts`,
    graphData: `${API_GATEWAY_BASE_URL}/graphData`,
    cardsData: `${API_GATEWAY_BASE_URL}/cardsData`,
    listUnlist: `${API_GATEWAY_BASE_URL}/listUnlist/courseId`
}

