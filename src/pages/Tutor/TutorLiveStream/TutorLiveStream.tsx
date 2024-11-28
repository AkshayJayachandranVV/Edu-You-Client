import  { useEffect, useRef } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useParams } from 'react-router-dom';


function TutorLiveStream() {
    const { courseId } = useParams(); // Use courseId as roomId
    const containerRef = useRef(null);
    const role = ZegoUIKitPrebuilt.Host; // Tutor is the host role

    const tutorId = localStorage.getItem("tutorId")

    const initialized = useRef(false); // Ensure initMeeting is only called once

    useEffect(() => {
        const initMeeting = async () => {
            if (initialized.current) return; // Exit if already initialized
            initialized.current = true;

            const appID = parseInt(import.meta.env.VITE_LIVE_APP_ID);
            const serverSecret = import.meta.env.VITE_LIVE_SERVER_SECRET;

            if (!appID || !serverSecret || !courseId) {
                console.error("App ID, Server Secret, or courseId is missing");
                return;
            }

            if(!tutorId){
                 console.error("tutorIdd is missing");
                return;
            }

            const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                appID,
                serverSecret,
                courseId, // Use courseId directly as roomId
                tutorId, // Generate a unique user ID
                "Tutor"
            );

            const zp = ZegoUIKitPrebuilt.create(kitToken);



            zp.joinRoom({
                container: containerRef.current,
                scenario: {
                    mode: ZegoUIKitPrebuilt.LiveStreaming,
                    config: { role },
                },
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

export default TutorLiveStream;
