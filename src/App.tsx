import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminRoutes from './routes/admin/AdminRoutes'
import UserRoutes from './routes/user/UserRoutes'
import TutorRoutes from './routes/tutor/TutorRoutes'
import {useEffect} from 'react'
import socketService from "./socket/socketService";
import { toast } from 'sonner';


import './index.css';


function App() {


  useEffect(() => {
    // Check if the user is already logged in by looking for a token or user ID
    const userId = localStorage.getItem("userId");
    if (userId) {
      // Connect to socket if user is logged in
      socketService.connect();
      
      socketService.onReceiveNotification((notification) => {
        console.log("New notification received:", notification);
        toast.success(notification.notification)
      });

    }

    // Cleanup function to disconnect socket on app unmount
    return () => {
      socketService.disconnect();
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/tutor/*" element={<TutorRoutes />} />
        <Route path="/*" element={<UserRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
   