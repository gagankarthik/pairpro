"use client";
import { useState } from 'react';
import { ref, set, get } from 'firebase/database';
import { database } from '@/firebaseConfig';
import toast, { Toaster } from 'react-hot-toast';

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

const ConnectRoom = ({ onConnect }) => {
  const [code, setCode] = useState('');

  const handleCreateRoom = async () => {
    const newCode = generateCode();
    await set(ref(database, `rooms/${newCode}`), { code: newCode, codeContent: '// Start coding...' });
    toast.success(`Room created with code: ${newCode}`);
    onConnect(newCode);
  };

  const handleJoinRoom = async () => {
    const roomRef = ref(database, `rooms/${code}`);
    const roomSnapshot = await get(roomRef);
    if (roomSnapshot.exists()) {
      toast.success('Joined room successfully');
      onConnect(code);
    } else {
      toast.error('Room does not exist');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <Toaster />
      <div className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-6 text-center">CodeCollab</h2>
        <div className="flex flex-col space-y-4">
          <button
            onClick={handleCreateRoom}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Create Room
          </button>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter Code"
            className="p-2 border rounded"
          />
          <button
            onClick={handleJoinRoom}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectRoom;
