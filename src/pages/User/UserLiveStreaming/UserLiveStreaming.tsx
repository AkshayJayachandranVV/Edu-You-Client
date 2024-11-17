import React, { useEffect, useRef } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useParams } from 'react-router-dom';
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";

function UserLiveStream() {
    const { courseId } = useParams(); // Use courseId as roomId
    const containerRef = useRef(null);
    const role = ZegoUIKitPrebuilt.Audience; // Set user as audience
    const { username } = useSelector((state: RootState) => state.user);

    const initialized = useRef(false); // Ensure initMeeting is only called once

    const userId = localStorage.getItem("userId")

    useEffect(() => {
        const initMeeting = async () => {
            if (initialized.current) return;
            initialized.current = true;

            const appID = import.meta.env.VITE_LIVE_APP_ID;
            const serverSecret = import.meta.env.VITE_LIVE_SERVER_SECRET;

            if (!appID || !serverSecret || !courseId) {
                console.error("App ID, Server Secret, or courseId is missing");
                return;
            }


            
            if(!userId){
                console.error("tutorIdd is missing");
               return;
           }

            const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                appID,
                serverSecret,
                courseId, // Use courseId as roomId
                userId , // Generate a unique user ID for the session
                username
            );

            const zp = ZegoUIKitPrebuilt.create(kitToken);

            zp.joinRoom({
                container: containerRef.current,
                scenario: {
                    mode: ZegoUIKitPrebuilt.LiveStreaming,
                    config: { role },
                },


                showPreJoinView: false,
                showLeavingView: false,
                showAudioVideoSettingsButton: false,
                layout: "Grid",
                useFrontFacingCamera: false,
                turnOnMicrophoneWhenJoining: false,
                turnOnCameraWhenJoining: false,
                showMyMicrophoneToggleButton: false,  // Corrected property name
                showMyCameraToggleButton: false,      // Corrected property name


            });
        };

        initMeeting();
    }, [courseId, role]);

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <div ref={containerRef} />
        </div>
    );  
}

export default UserLiveStream;
