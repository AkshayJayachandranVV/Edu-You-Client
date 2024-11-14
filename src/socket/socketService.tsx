import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket;
  private retryCount: number = 0;
  private maxRetries: number = 5;
  private retryDelay: number = 2000;

  constructor() {
    const userId = localStorage.getItem("userId")
    this.socket = io(`http://localhost:4000?userId=${userId}`, {
      transports: ['websocket'],
      upgrade: false,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
      this.retryCount = 0;
    });

    this.socket.on('disconnect', (reason: string) => {
      console.log('Socket disconnected:', reason);
      this.handleReconnect();
    });

    this.socket.on('connect_error', (error: Error) => {
      console.log('Socket connection error', error);
    });
  }

  onDisconnect(callback) {
    if (this.socket) {
      this.socket.on("disconnect", callback);
    }
  }



// Emit readMessages event with roomId
messageReadUpdate(roomId:string) {
  console.log(`Attempting to send readMessages for roomId: ${roomId}`);
  if (this.socket.connected) {
    this.socket.emit('readMessages', roomId); // Emit the event with roomId
  } else {
    console.error('Socket is not connected');
  }
}

// Listen for messagesRead event
onMessagesRead(callback:any) {
  this.socket.on('messagesRead', () => {
    console.log('Messages marked as read');
    callback();
  });
}



  


  public getSocket(): Socket {
    return this.socket;
  }

  emitTyping(isTyping: boolean,roomId:string,username:string) {
    this.socket?.emit('typingStatus', {isTyping,roomId,username});
}

onTypingStatus(callback: (data: { isTyping: boolean; username: string }) => void) {
  this.socket?.on('typingStatus', callback);
}

offTypingStatus(callback: (data: { isTyping: boolean; username: string }) => void) {
    this.socket?.off('typingStatus', callback);
}


  connect() {
    if (!this.socket.connected) {
      this.socket.connect();
    }
  }

  disconnect() {

    if (this.socket.connected) {
     
      // this.socket.emit("readDisconnect")
      this.socket.disconnect();
    }
  }

  joinRoom(courseId: string) {
    console.log(`Joined room: ${courseId}`);
    this.socket.emit('joinRoom', courseId);
  }


  liveStream({courseId, roomId, tutorId,sharedLink}: {courseId:string, roomId: string, tutorId: string,sharedLink:string}) {
    console.log(`Attempting to send message to room: ${roomId}, senderId: ${tutorId}, sjsjsj${courseId},gshsjshjs${sharedLink}`);
    if (this.socket.connected) {
      this.socket.emit('goLive', { roomId, tutorId,courseId,sharedLink});
    } else {
      console.error('Socket is not connected');
    }
  }



  sendMessage({ roomId, senderId, content }: { roomId: string, senderId: string, content: string }) {
    console.log(`Attempting to send message to room: ${roomId}, message: ${content}, senderId: ${senderId}`);
    if (this.socket.connected) {
      this.socket.emit('sendMessage', { roomId, senderId, content });
    } else {
      console.error('Socket is not connected');
    }
  }

  
  // New function to send media (image/video)
  sendMedia({ roomId, senderId, mediaUrl, s3Key, mediaType }: { roomId: string, senderId: string, mediaUrl: string, s3Key: string, mediaType: string }) {
    console.log(`Attempting to send media to room: ${roomId}, mediaUrl: ${mediaUrl}, senderId: ${senderId}, s3Key: ${s3Key}, mediaType: ${mediaType}`);
  
    if (this.socket.connected) {
      this.socket.emit('sendMedia', { roomId, senderId, mediaUrl, s3Key, mediaType });
      console.log('Media sent successfully');
    } else {
      console.error('Socket is not connected');
    }
  }


  offReceiveMedia(callback: (data: { mediaUrl: string; s3Key: string; mediaType: string }) => void) {
    this.socket.off('receiveMedia', callback);
  }
  
  

  RecieveLiveStreamLink(callback: (data: { roomId: string; tutorId: string; sharedLink: string }) => void) {
    this.socket.on('liveStreamLink', (data: { roomId: string; tutorId: string; sharedLink: string }) => {
      console.log('Received live stream link:', data);
      callback(data);
    });
  }
  

  onReceiveMessage(callback: (message: string) => void) {
    this.socket.on('receiveMessage', (message: string) => {
      console.log('Received message:', message);
      callback(message);
    });   
  }   

  onReceiveMedia(callback: (data: { mediaUrl: string; s3Key: string; mediaType: string }) => void) {
    this.socket.on('receiveMedia', (data: { mediaUrl: string; s3Key: string; mediaType: string }) => {
      console.log('Received media:', data);
      callback(data);
    });
  }
 

  onReceiveNotification(callback: (notification: { roomId: string; senderId: string; notification: string }) => void) {
    this.socket.on('receiveNotification', (notification) => {
      console.log('Received notification:', notification);
      callback(notification);
    });
  }


  onMessageRead(callback: (data: { isRead: boolean; messageId: string }) => void) {
    this.socket.on('messageRead', (data: { isRead: boolean; messageId: string }) => {
        console.log('Message read status received:', data);
        callback(data);
    });
}
  

  private handleReconnect() {
    if (this.retryCount < this.maxRetries) {
      console.log(`Retrying connection... (${this.retryCount + 1}/${this.maxRetries})`);
      this.retryCount += 1;
      setTimeout(() => {
        this.socket.connect();
      }, this.retryDelay);
    } else {
      console.error('Max retry attempts reached. Could not reconnect.');
    }
  }
}

export default new SocketService();
