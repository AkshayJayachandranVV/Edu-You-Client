// import axios from 'axios';

// const axiosInstance = axios.create({
//   baseURL: 'http://localhost:4000',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });



// axiosInstance.interceptors.request.use((config) => {
//     const token = localStorage.getItem('userAccessToken');
//     console.log(token,"got the userAccessToken ---------------")
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   }, (error) => {
//     return Promise.reject(error);
//   });
  
//   export default axiosInstance;


import axios from 'axios';

// Function to get a cookie by name
function getCookie(name: string): string | null {
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
function deleteCookie(name: string) {
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
    const token = getCookie('userAccessToken'); // Get token from cookies
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor to Handle Token Expiry and Unauthorized Access
axiosInstance.interceptors.response.use(
  (response) => response, // Simply return response if successful
  (error) => {
    // Check if the error response status is 401
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized access, redirecting to login...');

      // Clear the expired token from cookies
      deleteCookie('userAccessToken');

      // Redirect to login page (use history, navigate, or window location)
      window.location.href = '/login'; // Alternatively, you can use history or navigate if using React Router

      return Promise.reject('Unauthorized access, redirecting to login.');
    }

    // For other errors, simply reject the promise
    return Promise.reject(error);
  }
);

export default axiosInstance;



