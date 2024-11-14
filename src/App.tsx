// App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminRoutes from './routes/admin/AdminRoutes';
import UserRoutes from './routes/user/UserRoutes';
import TutorRoutes from './routes/tutor/TutorRoutes';
import { useEffect } from 'react';
import SocketService from "./socket/socketService";
import { toast } from 'sonner';

import './index.css';

function App() {
  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      const connectSocket = () => {
        // Connect to the socket
        SocketService.connect();

        // Join the user-specific room
        SocketService.joinRoom(userId);

        // Handle notifications
        SocketService.onReceiveNotification((notification) => {
          toast.success(notification.notification);
        });

        // Automatically reconnect if disconnected
        SocketService.onDisconnect(() => {
          console.log("Socket disconnected. Attempting to reconnect...");
          setTimeout(connectSocket, 1000);  // Retry connection after a delay
        });
      };

      // Initial connection
      connectSocket();

      // Clean up: disconnect socket on logout or component unmount
      return () => {
        SocketService.disconnect();
      };
    }
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
