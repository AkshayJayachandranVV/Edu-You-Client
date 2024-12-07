import { useState } from "react";
import { FaRobot } from "react-icons/fa";
import ChatBotModal from "./ChatBotModal"; // Create this component for the modal

const ChatBotIcon = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        className="fixed bottom-6 right-6 bg-[#ca8a04] rounded-full p-4 cursor-pointer shadow-lg hover:scale-110 transition-transform duration-300"
        onClick={() => setIsModalOpen(true)}
      >
        <FaRobot className="text-white text-3xl" />
      </div>
      {isModalOpen && (
        <ChatBotModal onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};

export default ChatBotIcon;
