import axios from 'axios';

// Function to get a cookie by name
function getCookie(name:string) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Function to remove a cookie
function deleteCookie(name:string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to Add Token to Headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie('adminAccessToken'); // Get token from cookies
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Admin access token added to headers:', token);
    } else {
      console.log('No admin access token found in cookies');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor to Handle Token Expiry and Unauthorized Access
axiosInstance.interceptors.response.use(
  (response) => response, // Simply return response if successful
  async (error) => {
    const originalRequest = error.config;

    // Check if the error response status is 401 or 403
    if ((error.response && error.response.status === 401) || (error.response && error.response.status === 403)) {
      console.log('Admin access token might be expired, attempting to refresh it...');
      
      const refreshToken = getCookie('adminRefreshToken');
      if (refreshToken) {
        console.log('Found admin refresh token in cookies:', refreshToken);

        try {
          // Call backend to refresh the token
          const response = await axios.post('http://localhost:4000/admin/refresh-token', { token: refreshToken });
          const { accessToken } = response.data;

          if (accessToken) {
            // Save new access token in cookies and retry the original request
            document.cookie = `adminAccessToken=${accessToken}; path=/;`;
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
            console.log('New admin access token received and saved. Retrying the original request...');

            return axiosInstance(originalRequest); // Retry the original request with the new token
          } else {
            console.log('No access token received in response. Redirecting to admin login...');
          }
        } catch (refreshError) {
          console.error('Error refreshing admin token:', refreshError);
        }
      } else {
        console.log('No admin refresh token available. Redirecting to login...');
      }

      // If refresh token is invalid or not available, redirect to login
      deleteCookie('adminAccessToken');
      deleteCookie('adminRefreshToken');
      window.location.href = '/admin/'; // Alternatively, use history/navigate if using React Router
    }

    // For other errors, simply reject the promise
    return Promise.reject(error);
  }
);

export default axiosInstance;
