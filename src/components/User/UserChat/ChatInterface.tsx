import React, { useState, useEffect, useRef } from "react";
import EmojiPicker from "emoji-picker-react";
import SocketService from "../../../socket/socketService";
import axiosInstance from "../../constraints/axios/userAxios";
import { userEndpoints } from "../../constraints/endpoints/userEndpoints";
import { tutorEndpoints } from "../../constraints/endpoints/TutorEndpoints";
import { CheckIcon } from "@heroicons/react/solid";
import axios from "axios";
import socketService from "../../../socket/socketService";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface Message {
  id: number;
  text?: string;
  messageId?: string;
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
  const [unreadMessageIds, setUnreadMessageIds] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesRef = useRef(messages);
  const userId = localStorage.getItem("userId");
  const [groupMembers, setGroupMembers] = useState([5]);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [latestRoomId, setLatestRoomId] = useState<string | null>(
  localStorage.getItem('latestRoomId')
);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const navigate = useNavigate();
  const { username } = useSelector((state: RootState) => state.user);

  //  console.log(selectedChat)

  useEffect(() => {
    console.log('Initial connection effect triggered');
    SocketService.connect();

    // Handle the case when page refreshes and there's no selectedChat
    const storedRoomId = localStorage.getItem('latestRoomId');
    if (!selectedChat && storedRoomId && userId) {
      console.log('No selectedChat, but found stored roomId:', storedRoomId);
      SocketService.unReadMessage(storedRoomId, userId);
    }

    return () => {
      console.log('Component unmounting, disconnecting socket');
      SocketService.disconnect();
    };
  }, []);






  useEffect(() => {
    console.log('Cleanup effect triggered');
    const handleChatExit = (roomId: string) => {
      if (roomId && userId) {
        console.log('Handling chat exit for room:', roomId);
        SocketService.unReadMessage(roomId, userId);
      }
    };

    return () => {
      const storedRoomId = localStorage.getItem('latestRoomId');
      if (selectedChat?.courseId) {
        console.log('Cleanup: handling exit for selectedChat room:', selectedChat.courseId);
        handleChatExit(selectedChat.courseId);
      } else if (storedRoomId) {
        console.log('Cleanup: handling exit for stored room:', storedRoomId);
        handleChatExit(storedRoomId);
      }
    };
  }, []);


  
 useEffect(() => {
    console.log('Selected chat change effect triggered');
    console.log('Current selectedChat:', selectedChat);
    console.log('Current latestRoomId:', latestRoomId);

    const handleChatExit = (roomId: string) => {
      if (roomId && userId) {
        console.log('Handling chat exit for room:', roomId);
        SocketService.unReadMessage(roomId, userId);
      }
    };

    if (selectedChat?.courseId) {
      console.log('New chat selected, joining room:', selectedChat.courseId);
      handleChatExit(selectedChat.courseId);
      SocketService.joinRoom(selectedChat.courseId);
      localStorage.setItem('latestRoomId', selectedChat.courseId);
    } else {
      const storedRoomId = localStorage.getItem('latestRoomId');
      if (storedRoomId) {
        console.log('No selectedChat, handling exit for stored room:', storedRoomId);
        handleChatExit(storedRoomId);
      }
    }
  }, [selectedChat]);
  
  





  const emitTyping = (isTyping: boolean, roomId: string, username: string) => {
    SocketService.emitTyping(isTyping, roomId, username); // Emit typing status with roomId and username
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    // Emit typing status
    emitTyping(true, selectedChat?.courseId, username);

    // Clear the previous timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set timeout to stop typing notification after a delay (e.g., 1 second)
    setTypingTimeout(
      setTimeout(() => {
        emitTyping(false, selectedChat.courseId, username); // Emit stop typing after delay
      }, 1000)
    );
  };

  useEffect(() => {
    // Listen for typing status from other users
    const typingHandler = (data: { isTyping: boolean; username: string }) => {
      if (data.isTyping) {
        setIsTyping(true);
        setTypingUser(data.username);
      } else {
        setIsTyping(false);
        setTypingUser(null);
      }
    };

    SocketService.onTypingStatus(typingHandler);

    return () => {
      SocketService.offTypingStatus(typingHandler);
    };
  }, []);

  const fetChGroupMember = async () => {
    try {
      console.log("enetered to fetchy members");
      if (!selectedChat) return;

      const roomId = selectedChat?.courseId;
      const response = await axiosInstance.get(
        `${userEndpoints.fetchGroupMembers}`,
        {
          params: { roomId },
        }
      );
      const fetchedUser = response.data.userData;

      setGroupMembers(fetchedUser);

      console.log("fetcehd user", fetchedUser);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchChat = async () => {
    try {
      if (!selectedChat || !userId) return;

      // Clear previous messages
      setMessages([]);
      setDisplayedMessages([]);
      setUnreadMessageIds([]); // Clear previous unread messages

      const roomId = selectedChat.courseId;
      const response = await axiosInstance.get(`${userEndpoints.fetchChat}`, {
        params: { roomId, userId },
      });
      const fetchedMessages = response.data;

      console.log("Fetched messages:", fetchedMessages);

      const formattedMessages = fetchedMessages.map(
        (message: any, index: number) => ({
          id: index + 1,
          messageId: message._id, // Store the _id as messageId
          text: message.content || "",
          mediaUrl: message.image || message.video || "",
          mediaType: message.image ? "image" : message.video ? "video" : "",
          sender: message.userId === userId ? "You" : message.username,
          time: new Date(message.createdAt).toLocaleTimeString(),
          isSender: message.userId === userId,
          isRead: message.isRead, // Include the isRead status
          username: message.username,
          profile_picture: message.profile_picture,
        })
      );

      // Filter unread messages and extract their messageId
      const unreadIds = formattedMessages
        .filter((message) => message.isRead === false)
        .map((message) => message.messageId);

      console.log(unreadIds, "this is the unRead ids");

      setMessages(formattedMessages);
      setDisplayedMessages(formattedMessages.slice(-6));
      setUnreadMessageIds(unreadIds);
    } catch (error) {
      console.error("Error fetching chat data:", error);
    }
  };

  useEffect(() => {
    if (selectedChat?.courseId) {
      // Ensure courseId is defined
      console.log("Unread message IDs:");

      const roomId = selectedChat.courseId;

      // Emit the readMessage event to the server with the roomId
      socketService.messageReadUpdate(roomId);
    }
  }, [selectedChat]); // Also add unreadMessageIds as a dependency if it's needed

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (selectedChat?.courseId) {
      // Emit read messages event to the server when a chat is selected
      SocketService.messageReadUpdate(selectedChat.courseId);
    }

    // Define the function that will mark messages as read
    const handleMessagesRead = () => {
      console.log("Received read message IDs:");

      // Update all messages to isRead: true
      setMessages((prevMessages) => {
        const updatedMessages = prevMessages.map((message) => ({
          ...message,
          isRead: true, // Set each message's isRead to true
        }));

        // Update the ref to reflect the latest message state
        messagesRef.current = updatedMessages;
        console.log("Updated messages:", messagesRef.current); // Log updated messages

        return updatedMessages;
      });
    };

    // Register the event listener for messagesRead
    SocketService.onMessagesRead(handleMessagesRead);

    // Cleanup listener on component unmount or dependency change
    return () => {
      SocketService.getSocket().off("messagesRead", handleMessagesRead);
    };
  }, [selectedChat]);

  useEffect(() => {
    SocketService.onMessageRead((data) => {
      if (data.isRead) {
        // Update all messages to isRead: true
        setMessages((prev) =>
          prev.map((msg) => ({
            ...msg,
            isRead: true, // Set isRead to true for all messages
          }))
        );
      }
    });

    return () => {
      SocketService.getSocket().off("messageRead");
    };
  }, []);

  useEffect(() => {
    const handleMediaReceive = (mediaData) => {
      console.log("New incoming media----- isRead:", mediaData.isRead);

      const newMediaMsg = {
        id: messagesRef.current.length + 1,
        messageId: mediaData.messageId,
        text: "", // No text for media messages
        mediaUrl: mediaData.mediaUrl,
        mediaType: mediaData.mediaType,
        sender:
          mediaData.userId === userId
            ? "You"
            : mediaData.userData?.username || mediaData.username,
        time: new Date().toLocaleTimeString(),
        isSender: mediaData.userId === userId,
        username: mediaData.userData?.username || mediaData.username,
        profile_picture:
          mediaData.userData?.profile_picture || mediaData.profile_picture,
      };

      // Update the state and ref
      setMessages((prev) => {
        const updatedMessages = [...prev, newMediaMsg];
        messagesRef.current = updatedMessages; // Keep the ref in sync with the latest state
        return updatedMessages;
      });

      setDisplayedMessages((prev) => [...prev.slice(-5), newMediaMsg]); // Update displayed messages
    };

    SocketService.onReceiveMedia(handleMediaReceive);
    return () => {
      SocketService.offReceiveMedia(handleMediaReceive);
    };
  }, [selectedChat]);

  useEffect(() => {
    if (selectedChat) {
      const fetchData = async () => {
        try {
          // Fetch chat messages
          await fetchChat();

          await fetChGroupMember();

          SocketService.joinRoom(selectedChat.courseId);
        } catch (error) {
          console.error("Error during fetchData:", error);
        }
      };

      fetchData();
      SocketService.joinRoom(selectedChat.courseId);

      const messageHandler = (message) => {
        console.log("New incoming message----- isRead:", message.isRead);

        const newMsg = {
          id: messagesRef.current.length + 1,
          messageId: message.messageId,
          text: message.content,
          mediaUrl: message.mediaUrl,
          mediaType: message.mediaType,
          sender:
            message.userId === userId
              ? "You"
              : message.userData?.username || message.username,
          time: new Date().toLocaleTimeString(),
          isSender: message.userId === userId,
          username: message.userData?.username || message.username,
          profile_picture:
            message.userData?.profile_picture || message.profile_picture,
        };

        // Update the state and ref
        setMessages((prev) => {
          const updatedMessages = [...prev, newMsg];
          messagesRef.current = updatedMessages; // Keep the ref in sync with the latest state
          return updatedMessages;
        });

        setDisplayedMessages((prev) => [...prev.slice(-5), newMsg]); // Update displayed messages
      };

      const typingHandler = (typingStatus) => setIsTyping(typingStatus);

      // Listen for incoming messages and typing status
      SocketService.onReceiveMessage(messageHandler);
      SocketService.onTypingStatus(typingHandler);

      return () => {
        // Clean up the event listeners on component unmount or when selectedChat changes
        SocketService.getSocket().off("receiveMessage", messageHandler);
        SocketService.getSocket().off("typingStatus", typingHandler);
      };
    } else {
      // Clear messages when there's no selected chat
      setMessages([]);
      setDisplayedMessages([]);
    }
  }, [selectedChat]);

  const loadMoreMessages = () => {
    setDisplayedMessages(
      messages.slice(-displayedMessages.length - 6, -displayedMessages.length)
    );
  };

  const handleSendMessage = async () => {
    if (selectedFile) {
      const uploadResponse = await uploadFile();
      if (uploadResponse) {
        const { key, url } = uploadResponse;
        // Send the message through the socket
        const response = await SocketService.sendMessage({
          roomId: selectedChat?.courseId,
          senderId: userId,
          content: key,
          mediaUrl: url,
          mediaType: selectedFile.type.startsWith("image/") ? "image" : "video",
        });
        // Store the sent message in the state
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: prevMessages.length + 1,
            mediaUrl: url,
            mediaType: selectedFile.type.startsWith("image/")
              ? "image"
              : "video",
            sender: "You",
            time: new Date().toLocaleTimeString(),
            isSender: true,
            username: "You",
            messageId: key, // Ensure you're using the same ID sent to the server
            isRead: false, // Initially set as unread
          },
        ]);
      }
      clearFileSelection();
    } else if (newMessage.trim()) {
      // Send the text message
      const response = await SocketService.sendMessage({
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
          isRead: false, // Initially set as unread
        },
      ]);
      setNewMessage("");
      SocketService.emitTyping(false);
      emitTyping(false);
    }
  };

  const handleSendMedia = async () => {
    if (selectedFile) {
      try {
        const uploadResponse = await uploadFile();
        if (uploadResponse) {
          const { key, url } = uploadResponse;
          const mediaType = selectedFile.type.startsWith("image/")
            ? "image"
            : "video";
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

      const response = await axiosInstance.get(
        tutorEndpoints.getPresignedUrlForUpload,
        {
          params: {
            filename: fileName,
            fileType: selectedFile.type,
          },
        }
      );

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

  // const onTyping = async()=>{
  //     try {
  //       console.log("enetered on Typing")
  //     } catch (error) {
  //       console.log(error)
  //     }
  // }

  useEffect(() => {
    const chatBox = messagesEndRef.current?.parentElement;
    if (chatBox) {
      const handleScroll = () => {
        if (
          chatBox.scrollTop === 0 &&
          displayedMessages.length < messages.length
        ) {
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

  const handleGoLive = () => {
    navigate(`/goLive/${selectedChat?.courseId}`);
  };

  return (
    <div className="flex flex-col bg-gray-900 text-white w-full lg:w-/4 h-full p-4">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg shadow-lg w-full">
        <div className="flex items-center space-x-3 w-full">
          {selectedChat && (
            <>
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={selectedChat.thumbnail}
                alt="Group Profile Pic"
              />
              <div className="flex flex-col">
                <span className="text-lg font-bold">
                  {selectedChat.courseName}
                </span>

                {/* Conditionally render typing status or group members */}
                <div className="text-sm text-gray-300 mt-1">
                  {isTyping && typingUser ? (
                    // Display typing status
                    <span className="font-semibold">
                      {typingUser} is typing...
                    </span>
                  ) : (
                    // Display group members
                    groupMembers &&
                    groupMembers.length > 0 &&
                    groupMembers.slice(0, 5).map((user, index) => (
                      <span key={user._id} className="font-semibold">
                        {user.username}
                        {index < groupMembers.length - 1 ? ", " : ""}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-400">Online</span>

          {/* "Go Live" button */}
          {selectedChat && ( // Only render the button if selectedChat is truthy
            <button
              onClick={handleGoLive} // Define this function to start the live stream
              className="px-4 py-2 bg-green-500 text-white rounded-md font-semibold hover:bg-green-600 transition duration-200"
            >
              Go Live
            </button>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.isSender ? "justify-end" : "justify-start"
            }`}
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
                <span className="text-xs text-gray-400 block">
                  {message.time}
                </span>
              </div>

              {/* Read/Unread Indicator */}
              {message.isSender && (
                <div className="flex items-center text-xs text-gray-400 mt-1">
                  <span className="mr-1">{message.time}</span>
                  {message.isRead ? (
                    <>
                      <CheckIcon
                        className="h-4 w-4 text-blue-500"
                        aria-label="Message read"
                      />
                      <CheckIcon
                        className="h-4 w-4 text-blue-500"
                        aria-label="Message read"
                      />
                    </>
                  ) : (
                    <CheckIcon
                      className="h-4 w-4 text-gray-400"
                      aria-label="Message sent"
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      {selectedChat && ( 
      <div className="flex items-center p-2 bg-gray-800 rounded-lg">
        <input
          type="text"
          className="flex-1 bg-gray-900 border-none p-2 text-white placeholder-gray-500 outline-none"
          placeholder="Type your message..."
          value={newMessage}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
        />
        <button
          className="text-gray-400 hover:text-gray-100"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          😀
        </button>
        <label
          htmlFor="mediaInput"
          className="cursor-pointer text-gray-400 hover:text-gray-100"
        >
          📎
        </label>
        <input
          type="file"
          id="mediaInput"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg ml-2"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
      )}

      {/* Emoji Picker */}
      {showEmojiPicker && <EmojiPicker onEmojiClick={handleEmojiClick} />}

      {/* Media Modal */}
      {showMediaModal && filePreviewUrl && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg">
            {selectedFile &&
              (selectedFile.type.startsWith("image/") ? (
                <img
                  src={filePreviewUrl}
                  alt="Preview"
                  className="max-h-64 object-cover mb-4"
                />
              ) : (
                <video
                  controls
                  src={filePreviewUrl}
                  className="max-h-64 mb-4"
                />
              ))}
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-600 text-white px-4 py-2 rounded"
                onClick={clearFileSelection}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSendMedia}
              >
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
