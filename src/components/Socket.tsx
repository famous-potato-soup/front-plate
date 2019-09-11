import React from 'react';
import socketio from 'socket.io-client';

const { REACT_APP_API_URL } = process.env;

const Socket = socketio.connect(`${REACT_APP_API_URL}`);

const SocketClient: React.FC = () => {
  Socket.on('enteredPlayer', function(obj: any): void {
    console.log(obj);
  });
  Socket.emit('enterPlayer', function(obj: any): void {
    console.log(obj);
  });
  return <div>Socket prototype</div>;
};

export default SocketClient;
