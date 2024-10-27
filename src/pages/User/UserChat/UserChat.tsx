import React, { useState, useEffect } from 'react';
import ChatList from '../../../components/User/UserChat/UserList';
import ChatInterface from '../../../components/User/UserChat/ChatInterface';
import Navbar from '../../../components/User/Home/UserHome/Navbar/Navbar';
import iconimage from '../../../assets/images/User/UserHome/Account.png';
import axiosInstance from '../../../components/constraints/axios/userAxios';
import { userEndpoints } from "../../../components/constraints/endpoints/userEndpoints";

// Define the Chat type
interface Chat {
  _id: string;
  courseName: string;
  thumbnail: string;
}

interface CourseResponse {
  _doc: {
    _id: string;
    courseName: string;
  };
  thumbnail: string;
}


const App: React.FC = () => {
  // Use the Chat[] type for chats and Chat | null for selectedChat
  const [chats, setChats] = useState<Chat[]>([]); // Chat list state
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null); // Selected chat state

  useEffect(() => {
    fetchChatList();
  }, []);
  
  const fetchChatList = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (userId) {
        const response = await axiosInstance.get(
          userEndpoints.getUserCourses.replace("userId", userId)
        );

        console.log(response,"--------------------------------------------------------------")
        
        const chatList: Chat[] = response.data.courses.map((course: CourseResponse) => ({
          courseId: course._doc._id,  // Get courseId from _doc
          courseName: course._doc.courseName, // Get courseName from _doc
          thumbnail: course.thumbnail  // Use the signed thumbnail URL
        }));
  
        setChats(chatList); // Update state with chat data
      }
    } catch (error) {
      console.error("Error fetching chat list:", error);
    }
  };
  

  // Handler to select a chat from the list
  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat); // Set the selected chat
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <div>
        <Navbar iconimage={iconimage} />
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-grow" style={{ marginTop: '60px' }}>
        {/* Pass chats and the handler to ChatList */}
        <ChatList chats={chats} onSelectChat={handleChatSelect} />

        {/* Pass the selected chat to ChatInterface */}
        <ChatInterface selectedChat={selectedChat} />
      </div>
    </div>
  );
};

export default App;
