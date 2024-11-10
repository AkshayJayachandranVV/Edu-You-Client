import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminRoutes from './routes/admin/AdminRoutes'
import UserRoutes from './routes/user/UserRoutes'
import TutorRoutes from './routes/tutor/TutorRoutes'
import {useEffect} from 'react'
import SocketService from "./socket/socketService";
import { toast } from 'sonner';



import './index.css';


function App() {
  const [showLiveStreamModal, setShowLiveStreamModal] = useState(false);
  const [liveStreamLink, setLiveStreamLink] = useState('');



  // useEffect(() => {
  //   SocketService.connect();
  //   return () => {
  //     SocketService.disconnect();
  //   };
  // }, []);


  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
        SocketService.connect();
        SocketService.joinRoom(userId);  // Join general room

        SocketService.onReceiveNotification((notification) => {
            toast.success(notification.notification);
        });
    }

    return () => {
        SocketService.disconnect();
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
   