import React, { useState } from 'react';

function UsernameForm({ onUsernameSubmit }) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedUsername = username.trim();
    if (trimmedUsername) {
      onUsernameSubmit(trimmedUsername);
    }
  };

  return (
    <div className="username-page">
      <div className="username-page-container">
        <h1 className="title">Type your username to enter the Chat Room</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
              autoFocus
            />
          </div>
          <div className="form-group">
            <button type="submit" className="accent username-submit">
              Start Chatting
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UsernameForm;
