"use client"
import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const VideoChat = ({ room }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    const socket = io('http://localhost:4000');

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        setLocalStream(stream);
        localVideoRef.current.srcObject = stream;
      });

    socket.emit('join', room);

    const pc = new RTCPeerConnection();

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('candidate', event.candidate, room);
      }
    };

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    localStream?.getTracks().forEach(track => pc.addTrack(track, localStream));

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

    return () => {
      socket.disconnect();
      pc.close();
    };
  }, [room, localStream]);

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
    <div>
      <video ref={localVideoRef} autoPlay muted className="w-full h-auto mb-4"></video>
      <video ref={remoteVideoRef} autoPlay className="w-full h-auto"></video>
      <div className="mt-4">
        <button onClick={toggleVideo} className="mr-2 bg-blue-500 text-white py-1 px-3 rounded">video</button>
        <button onClick={toggleAudio} className="bg-blue-500 text-white py-1 px-3 rounded"> Audio</button>
      </div>
    </div>
  );
};

export default VideoChat;
