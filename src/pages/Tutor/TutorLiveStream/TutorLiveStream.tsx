import React, { useEffect, useRef } from 'react';
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useParams } from "react-router-dom";
import socketService from '../../../socket/socketService';
import { v4 as uuidv4 } from 'uuid';


function TutorLiveStream() {
    const { courseId } = useParams(); // useParams now gets courseId
    const containerRef = useRef(null);
    const isInitialized = useRef(false);  // Flag to prevent multiple joinRoom calls
    const tutorId: string | null = localStorage.getItem("tutorId");
    const roomId = uuidv4(); // Generate a unique roomId for this session

    useEffect(() => {
        const initMeeting = async () => {
            const appID = 1971649609;
            const serverSecret = import.meta.env.VITE_LIVE_SERVER_SECRET;

            if (!appID || !serverSecret) {
                console.error("App ID or Server Secret is missing");
                return;
            }

            // Prevent repeated joinRoom calls
            if (isInitialized.current) return;
            isInitialized.current = true;

            const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                appID,
                serverSecret,
                roomId,
                Date.now().toString(), // Unique user ID for each viewer
                "Audience"
              );

            const zp = ZegoUIKitPrebuilt.create(kitToken);
            // const role = ZegoUIKitPrebuilt.Host;

            // const sharedLinks = [
            //     {
            //         name: "Join as audience",
            //         url: `${window.location.origin}${window.location.pathname}?roomID=${roomId}&role=Audience`,
            //     },
            // ];

            zp.joinRoom({
                container: containerRef.current,
                scenario: {
                  mode: ZegoUIKitPrebuilt.LiveStreaming,
                  config: {
                    role: ZegoUIKitPrebuilt.Audience, // Audience role for viewers
                  },
                },
              });
        };

        if (courseId && tutorId) {
            socketService.liveStream({ courseId, roomId, tutorId }); // Use the unique roomId in the socket call
        } else {
            console.error("Cannot go live: Missing courseId or userId");
        }

        initMeeting();
    }, [courseId, roomId, tutorId]); // Ensure this only re-runs if any of these change

    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <div ref={containerRef} />
        </div>
    );
}

export default TutorLiveStream;
