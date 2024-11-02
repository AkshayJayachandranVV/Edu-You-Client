import React, { useState, useEffect, useRef } from "react";
import EmojiPicker from "emoji-picker-react";
import SocketService from "../../../socket/socketService";
import axiosInstance from "../../constraints/axios/userAxios";
import { userEndpoints } from "../../constraints/endpoints/userEndpoints";
import { tutorEndpoints } from "../../constraints/endpoints/TutorEndpoints";
import axios from "axios";

interface Message {
  id: number;
  text?: string;
  mediaUrl?: string;
  mediaType?: string;
  sender: string;
  time: string;
  isSender: boolean;
  username: string;
  profile_picture?: string;
}

interface ChatInterfaceProps {
  selectedChat: {
    courseId: string;
    courseName: string;
    thumbnail: string;
  } | null;
}


const ChatInterface: React.FC<ChatInterfaceProps> = ({ selectedChat }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const userId = localStorage.getItem("userId");


  useEffect(() => {
    SocketService.connect();
    return () => {
      SocketService.disconnect();
    };
  }, []);

  const fetchChat = async () => {
    try {
      if (!selectedChat || !userId) return;
      const roomId = selectedChat.courseId;
      const response = await axiosInstance.get(`${userEndpoints.fetchChat}`, { params: { roomId, userId } });
      console.log(response.data,"deyyyyyyyyyyyyyy messqge")
      const fetchedMessages = response.data;
      const formattedMessages = fetchedMessages.map((message: any, index: number) => ({
        id: index + 1,
        text: message.content || "",
        mediaUrl: message.image || message.video || "",
        mediaType: message.image ? "image" : message.video ? "video" : "",
        sender: message.userId === userId ? "You" : message.username,
        time: new Date(message.createdAt).toLocaleTimeString(),
        isSender: message.userId === userId,
        username: message.username,
        profile_picture: message.profile_picture,
      }));

      setMessages(formattedMessages);
      setDisplayedMessages(formattedMessages.slice(-6));
    } catch (error) {
      console.error("Error fetching chat data:", error);
    }
  };
  
  

  


  useEffect(() => {
    const handleMediaReceive = (data) => {
      const { mediaUrl, s3Key, mediaType } = data;
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          mediaUrl,
          mediaType,
          sender: "Other User",
          time: new Date().toLocaleTimeString(),
          isSender: false,
          username: "Other User",
        },
      ]);
    };

    SocketService.onReceiveMedia(handleMediaReceive);
    return () => {
      SocketService.offReceiveMedia(handleMediaReceive);
    };
  }, [selectedChat]);
  

  

  useEffect(() => {
    if (selectedChat) {
      fetchChat();
      SocketService.joinRoom(selectedChat.courseId);
  
      const messageHandler = (message: any) => {
        const newMsg = {
          id: messages.length + 1,
          text: message.content, // or message.text if it's a string message
          mediaUrl: message.mediaUrl,
          mediaType: message.mediaType,
          sender: message.userId === userId ? "You" : message.userData?.username || message.username,
          time: new Date().toLocaleTimeString(),
          isSender: message.userId === userId,
          username: message.userData?.username || message.username,
          profile_picture: message.userData?.profile_picture || message.profile_picture,
        };
  
        setMessages((prev) => [...prev, newMsg]);
        setDisplayedMessages((prev) => [...prev.slice(-5), newMsg]);
      };
  
      const typingHandler = (typingStatus) => setIsTyping(typingStatus);
  
      SocketService.onReceiveMessage(messageHandler);
      SocketService.onTypingStatus(typingHandler);
  
      return () => {
        SocketService.getSocket().off("receiveMessage", messageHandler);
        SocketService.getSocket().off("typingStatus", typingHandler);
      };
    }
  }, [selectedChat]);
  


  const loadMoreMessages = () => {
    setDisplayedMessages(messages.slice(-displayedMessages.length - 6, -displayedMessages.length));
  };

  const handleSendMessage = async () => {
    if (selectedFile) {
      const uploadResponse = await uploadFile();
      if (uploadResponse) {
        const { key, url } = uploadResponse;
        SocketService.sendMessage({
          roomId: selectedChat?.courseId,
          senderId: userId,
          content: key,
          mediaUrl: url,
          mediaType: selectedFile.type.startsWith('image/') ? 'image' : 'video',
        });
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: prevMessages.length + 1,
            mediaUrl: url,
            mediaType: selectedFile.type.startsWith('image/') ? 'image' : 'video',
            sender: "You",
            time: new Date().toLocaleTimeString(),
            isSender: true,
            username: "You",
          },
        ]);
      }
      clearFileSelection();
    } else if (newMessage.trim()) {
      SocketService.sendMessage({
        roomId: selectedChat?.courseId,
        senderId: userId,
        content: newMessage,
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          text: newMessage,
          sender: "You",
          time: new Date().toLocaleTimeString(),
          isSender: true,
          username: "You",
        },
      ]);
      setNewMessage("");
      SocketService.emitTyping(false);
    }
  };

  const handleSendMedia = async () => {
    if (selectedFile) {
      try {
        const uploadResponse = await uploadFile();
        if (uploadResponse) {
          const { key, url } = uploadResponse;
          const mediaType = selectedFile.type.startsWith("image/") ? "image" : "video";
          SocketService.sendMedia({
            roomId: selectedChat?.courseId || "",
            senderId: userId || "",
            mediaUrl: url,
            s3Key: key,
            mediaType,
          });
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              id: prevMessages.length + 1,
              mediaUrl: url,
              mediaType,
              sender: "You",
              time: new Date().toLocaleTimeString(),
              isSender: true,
              username: "You",
            },
          ]);
          clearFileSelection();
        }
      } catch (error) {
        console.error("Error uploading or sending media:", error);
      }
    } else {
      console.error("No file selected to send.");
    }
  };
  
  
  
  

  const handleEmojiClick = (emojiObject: any) => {
    setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFilePreviewUrl(previewUrl);
      setSelectedFile(file);
      setShowMediaModal(true); // Show modal for file preview
    }
  };

  const clearFileSelection = () => {
    setFilePreviewUrl(null);
    setSelectedFile(null);
    setShowMediaModal(false); // Close modal
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      console.error("No file selected for upload");
      return null;
    }

    try {
      const fileName = generateFileName(selectedFile.name);

      const response = await axiosInstance.get(tutorEndpoints.getPresignedUrlForUpload, {
        params: {
          filename: fileName,
          fileType: selectedFile.type,
        },
      });

      const { uploadUrl, viewUrl, key } = response.data;

      const result = await axios.put(uploadUrl, selectedFile, {
        headers: {
          "Content-Type": selectedFile.type,
        },
      });

      if (result.status === 200) {
        return { url: viewUrl, key }; // Return the view URL and S3 key
      } else {
        console.error("File upload failed with status:", result.status);
        return null;
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  };

  const generateFileName = (originalName: string) => {
    const extension = originalName.split(".").pop();
    return `${Math.random().toString(36).substring(2, 15)}.${extension}`;
  };


  useEffect(() => {
    const chatBox = messagesEndRef.current?.parentElement;
    if (chatBox) {
      const handleScroll = () => {
        if (chatBox.scrollTop === 0 && displayedMessages.length < messages.length) {
          loadMoreMessages();
        }
      };
      chatBox.addEventListener("scroll", handleScroll);
      return () => chatBox.removeEventListener("scroll", handleScroll);
    }
  }, [displayedMessages]);


  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };
    scrollToBottom();
  }, [displayedMessages, messages]);


  
  return (
<div className="flex flex-col bg-gray-900 text-white w-full lg:w-3/4 h-full p-4">
  {/* Chat Header */}
  <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg shadow-lg">
    <div className="flex items-center space-x-3">
      {selectedChat && (
        <>
          <img
            className="h-10 w-10 rounded-full object-cover"
            src={selectedChat.thumbnail}
            alt="Group Profile Pic"
          />
          <span className="text-lg font-bold">{selectedChat.courseName}</span>
        </>
      )}
    </div>
    <span className="text-sm text-gray-400">Online</span>
  </div>

  {/* Chat Messages */}
  {/* Chat Messages */}
<div className="flex-1 overflow-y-auto p-4 space-y-2">
  {messages.map((message) => (
    <div
      key={message.id}
      className={`flex ${message.isSender ? "justify-end" : "justify-start"}`}
    >
      {!message.isSender && (
        <img
          className="h-8 w-8 rounded-full object-cover mr-2"
          src={message.profile_picture}
          alt={`${message.username}'s Profile Pic`}
        />
      )}
      <div
        className={`flex flex-col space-y-1 ${
          message.isSender ? "items-end" : "items-start"
        }`}
      >
        {/* Display the username */}
        {!message.isSender && (
          <span className="text-sm font-semibold text-gray-300">
            {message.username}
          </span>
        )}
        <div
          className={`rounded-lg p-3 max-w-xs break-words ${
            message.isSender
              ? "bg-blue-500 text-white"
              : "bg-gray-800 text-white"
          }`}
        >
          {/* Logic for displaying content */}
          {message.mediaUrl ? (
            message.mediaType === "image" ? (
              <img
                src={message.mediaUrl}
                alt="Sent media"
                className="rounded-lg max-h-40 object-cover"
              />
            ) : message.mediaType === "video" ? (
              <video
                controls
                src={message.mediaUrl}
                className="rounded-lg max-h-40"
              />
            ) : null
          ) : (
            <p>{message.text}</p>
          )}
          <span className="text-xs text-gray-400 block">{message.time}</span>
        </div>
      </div>
    </div>
  ))}
  <div ref={messagesEndRef} />
</div>



  {/* Message Input */}
  <div className="flex items-center p-2 bg-gray-800 rounded-lg">
    <input
      type="text"
      className="flex-1 bg-gray-900 border-none p-2 text-white placeholder-gray-500 outline-none"
      placeholder="Type your message..."
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleSendMessage();
      }}
    />
    <button className="text-gray-400 hover:text-gray-100" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
      😀
    </button>
    <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="hidden" id="mediaInput" />
    <label htmlFor="mediaInput" className="cursor-pointer text-gray-400 hover:text-gray-100">
      📎
    </label>
    <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg ml-2" onClick={handleSendMessage}>
      Send
    </button>
  </div>

  {/* Emoji Picker */}
  {showEmojiPicker && <EmojiPicker onEmojiClick={handleEmojiClick} />}

  {/* Media Modal */}
  {showMediaModal && (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg">
        {filePreviewUrl && selectedFile && (
          selectedFile.type.startsWith('image/') ? (
            <img src={filePreviewUrl} alt="Preview" className="max-h-64 object-cover mb-4" />
          ) : (
            <video controls src={filePreviewUrl} className="max-h-64 mb-4" />
          )
        )}
        <div className="flex justify-end space-x-4">
          <button className="bg-gray-600 text-white px-4 py-2 rounded" onClick={clearFileSelection}>
            Cancel
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSendMedia}>
            Send
          </button>
        </div>
      </div>
    </div>
  )}
</div>

  );
};

export default ChatInterface;
