"use client"
import { useState } from 'react';
import { ref, set, get } from 'firebase/database';
import { database } from '@/firebaseConfig';

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

const ConnectRoom = ({ onConnect }) => {
  const [code, setCode] = useState('');

  const handleCreateRoom = async () => {
    const newCode = generateCode();
    await set(ref(database, `rooms/${newCode}`), { code: newCode });
    onConnect(newCode);
  };

  const handleJoinRoom = async () => {
    const roomRef = ref(database, `rooms/${code}`);
    const roomSnapshot = await get(roomRef);
    if (roomSnapshot.exists()) {
      onConnect(code);
    } else {
      alert('Room does not exist');
    }
  };

  return (
    <div className='flex items-center'>
      <button onClick={handleCreateRoom}>Create Room</button>
      <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter Code" />
      <button onClick={handleJoinRoom}>Join Room</button>
    </div>
  );
};

export default ConnectRoom;
