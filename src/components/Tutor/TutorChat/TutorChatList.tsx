import React from 'react';
import moment from 'moment';

interface Chat {
  _id:string;
  courseId: string;
  courseName: string;
  thumbnail: string;
  lastMessage: string;
  lastMessageTime: string;
  isRead?: boolean;
}

interface ChatListProps {
  chats: Chat[]; 
  onSelectChat: (chat: Chat) => void; 
}
const TutorChatList: React.FC<ChatListProps> = ({ chats, onSelectChat }) => {

  console.log(chats,"alll chatssss")
  return (
    <div className="flex flex-col bg-gray-800 text-white w-full lg:w-1/4 h-full p-4 border-r border-gray-700">
      <div className="text-lg font-semibold mb-4">Chats</div>
      {chats.length > 0 ? (
        chats.map((chat) => (
          <div
            key={chat.courseId}
            className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 mb-3 cursor-pointer transition-colors duration-300"
            onClick={() => onSelectChat(chat)}
          >
            <div className="flex items-center space-x-3">
              <img
                className="h-12 w-12 rounded-full object-cover"
                src={chat.thumbnail}
                alt={`${chat.courseName} Thumbnail`}
              />
              <div className="flex flex-col flex-1">
                <span className="text-sm font-bold">{chat.courseName}</span>
                <span className="text-xs font-semibold text-gray-300 truncate">
                  {chat.lastMessage ? chat.lastMessage : "No messages yet"}
                </span>
              </div>
              <div className="text-right text-xs flex flex-col items-end">
                <span className="text-gray-400">
                  {chat.lastMessageTime ? moment(chat.lastMessageTime).format("hh:mm A") : ""}
                </span>
                {!chat.isRead && (
                  <span className="text-xs text-blue-500 font-semibold mt-1">Unread</span>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No chats available.</p>
      )}
    </div>
  );
};

export default TutorChatList;
