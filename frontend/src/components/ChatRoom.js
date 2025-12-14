import React, { useState, useEffect, useRef } from 'react';
import { useWebSocket } from '../services/websocketService';

const COLORS = [
  '#2196F3', '#32c787', '#00BCD4', '#ff5652',
  '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

function ChatRoom({ username, onConnectionChange }) {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const { connect, disconnect, sendMessage, connected } = useWebSocket();

  useEffect(() => {
    onConnectionChange(connected);
    setIsConnected(connected);
  }, [connected, onConnectionChange]);

  useEffect(() => {
    const handleMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    const handleError = (err) => {
      setError(err);
    };

    connect(username, handleMessage, handleError);

    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const trimmedMessage = messageInput.trim();
    if (trimmedMessage && isConnected) {
      sendMessage(trimmedMessage);
      setMessageInput('');
    }
  };

  const getAvatarColor = (sender) => {
    let hash = 0;
    for (let i = 0; i < sender.length; i++) {
      hash = 31 * hash + sender.charCodeAt(i);
    }
    const index = Math.abs(hash % COLORS.length);
    return COLORS[index];
  };

  return (
    <div className="chat-page">
      <div className="chat-container">
        <div className="chat-header">
          <h2>ChatApp</h2>
        </div>
        {!isConnected && (
          <div className="connecting">
            {error ? (
              <span className="error">
                Could not connect to WebSocket server. Please refresh this page to try again!
              </span>
            ) : (
              'Connecting...'
            )}
          </div>
        )}
        <ul className="message-area">
          {messages.map((message, index) => (
            <li
              key={index}
              className={
                message.type === 'JOIN' || message.type === 'LEAVE'
                  ? 'message-item event-message'
                  : 'message-item chat-message'
              }
            >
              {message.type === 'JOIN' && (
                <p>{message.sender} has joined the chat!</p>
              )}
              {message.type === 'LEAVE' && (
                <p>{message.sender} has left the chat!</p>
              )}
              {message.type === 'CHAT' && (
                <>
                  <div
                    className="avatar"
                    style={{ backgroundColor: getAvatarColor(message.sender) }}
                  >
                    {message.sender[0]}
                  </div>
                  <span>{message.sender}</span>
                  <p>{message.content}</p>
                </>
              )}
            </li>
          ))}
          <div ref={messagesEndRef} />
        </ul>
        <form className="message-form" onSubmit={handleSendMessage}>
          <div className="form-group">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                autoComplete="off"
                disabled={!isConnected}
              />
              <button
                type="submit"
                className="primary"
                disabled={!isConnected || !messageInput.trim()}
              >
                Send
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatRoom;
