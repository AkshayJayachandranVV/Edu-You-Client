import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
});



axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminAccessToken');
    console.log(token,"got the adminAccessToken ---------------")
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
});
  
  export default axiosInstance;