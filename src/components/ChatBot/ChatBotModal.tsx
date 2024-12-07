import axios from "axios";
import { useState } from "react";
import { IoClose } from "react-icons/io5";

const ChatBotModal = ({ onClose }: { onClose: () => void }) => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [userMessage, setUserMessage] = useState("");

  const handleSendMessage = async () => {
    if (userMessage.trim() === "") return; 
  
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    
    const currentMessage = userMessage; 
    setUserMessage(""); 
  
    try {
      const result = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyClWlCGCgEzs9ccULlpvNu8qV7jpwmgS1w`,
        method: "post",
        data: {
          contents: [
            {
              parts: [
                {
                  text: currentMessage, 
                },
              ],
            },
          ],
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const botReply =
        result?.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't understand that.";
  
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (error) {
      console.error("Error fetching response from Gemini API:", error);
  
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Oops! Something went wrong. Please try again later." },
      ]);
    }
  };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#1f2937] w-[90%] max-w-lg rounded-lg shadow-lg overflow-hidden">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 bg-[#ca8a04] text-white">
          <h2 className="text-lg font-semibold">Chat with Us</h2>
          <button className="text-xl hover:text-gray-300 transition" onClick={onClose}>
            <IoClose />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="p-4 h-64 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center">Say Hi to start chatting!</p>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`my-2 flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <p
                  className={`${
                    msg.sender === "user"
                      ? "bg-[#ca8a04] text-white"
                      : "bg-gray-200 text-gray-700"
                  } px-4 py-2 rounded-lg`}
                >
                  {msg.text}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t">
          <div className="flex">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-grow border rounded-l-lg px-3 py-2 focus:outline-none"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              className="bg-[#ca8a04] text-white px-4 py-2 rounded-r-lg hover:bg-[#b37d05] transition"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBotModal;