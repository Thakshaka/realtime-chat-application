import React, { useState } from 'react';
import UsernameForm from './components/UsernameForm';
import ChatRoom from './components/ChatRoom';
import './App.css';

function App() {
  const [username, setUsername] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const handleUsernameSubmit = (name) => {
    setUsername(name);
  };

  const handleConnectionChange = (connected) => {
    setIsConnected(connected);
  };

  return (
    <div className="App">
      {!username ? (
        <UsernameForm onUsernameSubmit={handleUsernameSubmit} />
      ) : (
        <ChatRoom 
          username={username} 
          onConnectionChange={handleConnectionChange}
        />
      )}
    </div>
  );
}

export default App;
