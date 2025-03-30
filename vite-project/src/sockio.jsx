import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://127.0.0.1:5000');

function Sockio() {
  const [runningNum, setRunningNum] = useState(null);

  useEffect(() => {
    socket.on('Hello', (data) => {
      setRunningNum(data.number);
      console.log('Received running number:', data.number);
    });

    return () => {
      socket.off('Hello');
    };
  }, []);

  const handleGetRunningNum = () => {
    socket.emit('Hello');
  };

  return (
    <div>
      <button className="predict" onClick={handleGetRunningNum}>get running num</button>
      {runningNum !== null && <p>Running Number: {runningNum}</p>}
    </div>
  );
}

export default Sockio;
