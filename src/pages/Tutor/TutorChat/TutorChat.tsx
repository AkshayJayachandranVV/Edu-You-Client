import React, { useState, useEffect } from 'react';
import ChatList from '../../../components/Tutor/TutorChat/TutorChatList';
import ChatInterface from '../../../components/Tutor/TutorChat/TutorChatInterface';
import axiosInstance from '../../../components/constraints/axios/tutorAxios';
import { tutorEndpoints } from "../../../components/constraints/endpoints/TutorEndpoints";

export interface Chat {
  _id: string;
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
  lastMessage : string;
  lastMessageTime:string;
}


const ChatApp: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]); // Chat list state
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null); // Selected chat state
  

  useEffect(() => {
    fetchChatList();
  }, []);

  const fetchChatList = async () => {
    try {
      console.log(selectedChat)
      const tutorId = localStorage.getItem("tutorId");
      if (tutorId) {
        const response = await axiosInstance.get(
            tutorEndpoints.getTutorCourses.replace("userId", tutorId)
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

  
  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat); // Set the selected chat
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Chat List on the left */}
      <ChatList chats={chats} onSelectChat={handleChatSelect} />

      {/* Chat Interface on the right */}
      <div className="flex-1" >
        <ChatInterface selectedChat={selectedChat} groupMembers={[]} />
      </div>
    </div>
  );
};

export default ChatApp;
