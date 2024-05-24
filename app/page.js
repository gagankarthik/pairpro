"use client";
import { useState } from 'react';
import CodeEditor from '@/components/CodeEditor';
import VideoChat from '@/components/VideoChat';
import ConnectRoom from '@/components/ConnectRoom';
import useAuth from '@/hooks/useAuth';

export default function Home() {
  const user = useAuth();
  const [room, setRoom] = useState(null);

  const handleConnect = (roomCode) => {
    setRoom(roomCode);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  if (!room) {
    return <ConnectRoom onConnect={handleConnect} />;
  }

  return (
    <div className="flex flex-col w-full h-screen">
      <div className="flex justify-between p-4">
        <h1 className="text-2xl font-bold">Pair Pro</h1>
        <button
          onClick={() => setRoom(null)}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
        >
          End Session
        </button>
      </div>
      <div className="flex-grow flex">
        <div className="w-1/3 p-2">
          <VideoChat room={room} />
        </div>
        <div className="w-2/3 p-2">
          <CodeEditor room={room} />
        </div>
      </div>
    </div>
  );
}
