"use client";
import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Mic, Video } from 'lucide-react';

const VideoChat = ({ room }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const initSocket = async () => {
      if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
        const socket = io('https://pairpro-flax.vercel.app'); // Update with your server URL
        socketRef.current = socket;

        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        socket.emit('join', room);

        const pc = new RTCPeerConnection();

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit('candidate', event.candidate, room);
          }
        };

        pc.ontrack = (event) => {
          setRemoteStream(event.streams[0]);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        socket.on('offer', (offer) => {
          pc.setRemoteDescription(new RTCSessionDescription(offer));
          pc.createAnswer()
            .then(answer => {
              pc.setLocalDescription(answer);
              socket.emit('answer', answer, room);
            });
        });

        socket.on('answer', (answer) => {
          pc.setRemoteDescription(new RTCSessionDescription(answer));
        });

        socket.on('candidate', (candidate) => {
          pc.addIceCandidate(new RTCIceCandidate(candidate));
        });

        setPeerConnection(pc);
      }
    };

    initSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (peerConnection) {
        peerConnection.close();
      }
    };
  }, [room]);

  const toggleVideo = () => {
    const videoTrack = localStream?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
    }
  };

  const toggleAudio = () => {
    const audioTrack = localStream?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full">
      <video ref={localVideoRef} autoPlay muted className="w-full h-1/2 mb-2 rounded"></video>
      <video ref={remoteVideoRef} autoPlay className="w-full h-1/2 rounded"></video>
      <div className="mt-4 flex space-x-2">
        <button onClick={toggleVideo} className="bg-blue-500 text-white py-2 px-4 rounded flex items-center">
          <Video className="mr-2" />
          Toggle Video
        </button>
        <button onClick={toggleAudio} className="bg-blue-500 text-white py-2 px-4 rounded flex items-center">
          <Mic className="mr-2" />
          Toggle Audio
        </button>
      </div>
    </div>
  );
};

export default VideoChat;
