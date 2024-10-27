import React from 'react';

// Define the props interface
interface ChatListProps {
  chats: Array<{
    courseId: string;
    courseName: string;
    thumbnail: string;
  }>;
  onSelectChat: (chat:unknown) => void; // Function to handle chat selection
}

const ChatList: React.FC<ChatListProps> = ({ chats, onSelectChat }) => {
  return (
    <div className="flex flex-col bg-gray-800 text-white w-full lg:w-1/4 h-full p-4 border-r border-gray-700">
      <div className="text-lg font-semibold mb-4">Chats</div>
      {chats.length > 0 ? (
        chats.map((chat) => (
          <div
            key={chat.courseId}
            className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 mb-3 cursor-pointer transition-colors duration-300"
            onClick={() => onSelectChat(chat)} // Call onSelectChat when clicked
          >
            <div className="flex items-center space-x-3">
              <img
                className="h-12 w-12 rounded-full object-cover"
                src={chat.thumbnail}
                alt={`${chat.courseName} Thumbnail`}
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold">{chat.courseName}</span>
                <span className="text-xs text-gray-300">Last Message</span>
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

export default ChatList;
