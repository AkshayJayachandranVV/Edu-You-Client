import React, { useState, useEffect } from 'react';
import ChatList from '../../../components/User/UserChat/UserList';
import ChatInterface from '../../../components/User/UserChat/ChatInterface';
import axiosInstance from '../../../components/constraints/axios/userAxios';
import { userEndpoints } from "../../../components/constraints/endpoints/userEndpoints";


interface Chat {
  courseId: string;
  courseName: string;
  thumbnail: string;
  lastMessage: string;
  lastMessageTime: string;
  isRead?: boolean;
}



interface CourseResponse {
  _doc: {
    _id: string;
    courseName: string;
  };
  thumbnail: string;
  lastMessage: string;
  lastMessageTime: string;
}


const App: React.FC = () => {
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

        console.log(response.data[0].thumbnail, "Fetched chat list");

        const chatList: Chat[] = response.data.map((course: CourseResponse) => ({
          courseId: course._doc._id,
          courseName: course._doc.courseName,
          thumbnail: course.thumbnail,
          lastMessage: course.lastMessage,
          lastMessageTime: course.lastMessageTime
          ,
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
<div className="flex flex-col lg:flex-row h-screen bg-gray-900 text-white">
  {/* Chat List on the left */}
  <div className="lg:w-1/4 w-full h-full">
    <ChatList chats={chats} onSelectChat={handleChatSelect} />
  </div>

  {/* Chat Interface on the right */}
  <div className="flex-1 w-full h-full">
    <ChatInterface selectedChat={selectedChat} groupMembers={[]} />
  </div>
</div>

  );
};

export default App;
