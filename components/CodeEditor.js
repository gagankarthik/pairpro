"use client";
import { useEffect, useState } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { ref, onValue, set } from 'firebase/database';
import { database } from '@/firebaseConfig';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';

const CodeEditor = ({ room }) => {
  const [code, setCode] = useState('// Start coding...');

  useEffect(() => {
    const codeRef = ref(database, `rooms/${room}/code`);
    const unsubscribe = onValue(codeRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCode(data);
      }
    });

    return () => unsubscribe();
  }, [room]);

  const handleCodeChange = (editor, data, value) => {
    setCode(value);
    set(ref(database, `rooms/${room}/code`), value);
  };

  return (
    <CodeMirror
      value={code}
      options={{
        mode: 'javascript',
        theme: 'material',
        lineNumbers: true,
        lineWrapping: true,
      }}
      onBeforeChange={handleCodeChange}
      className="h-full"
    />
  );
};

export default CodeEditor;
