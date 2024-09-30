export const API_GATEWAY_BASE_URL ='http://localhost:4000/admin';


export const adminEndpoints = {
    login : `${API_GATEWAY_BASE_URL}/login`,
    students : `${API_GATEWAY_BASE_URL}/students`,
    isBlocked : `${API_GATEWAY_BASE_URL}/isBlocked`,
    tutors : `${API_GATEWAY_BASE_URL}/tutors`,
    tutorIsBlocked : `${API_GATEWAY_BASE_URL}/tutorIsBlocked`,
}

