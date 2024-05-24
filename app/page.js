"use client"
import { useState } from 'react';
import CodeEditor from '@/components/CodeEditor';
import VideoChat from '@/components/VideoChat';
import ConnectRoom from '@/components/ConnectRoom';
import useAuth from '@/hooks/useAuth';

export default function Home() {
  const user = useAuth();
  const [room, setRoom] = useState(null);

  if (!user) {
    return <div>Loading...</div>;
  }

  if (!room) {
    return <ConnectRoom onConnect={setRoom} />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Remote Pair Programming</h1>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 p-2">
          <CodeEditor room={room} />
        </div>
        <div className="w-full md:w-1/2 p-2">
          <VideoChat room={room} />
        </div>
      </div>
    </div>
  );
}
