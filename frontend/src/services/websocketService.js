import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useState, useEffect, useRef, useCallback } from 'react';

export const useWebSocket = () => {
  const [connected, setConnected] = useState(false);
  const stompClientRef = useRef(null);
  const usernameRef = useRef(null);
  const onMessageCallbackRef = useRef(null);
  const onErrorCallbackRef = useRef(null);

  const connect = useCallback((username, onMessage, onError) => {
    usernameRef.current = username;
    onMessageCallbackRef.current = onMessage;
    onErrorCallbackRef.current = onError;
    
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    const socket = new SockJS(`${apiUrl}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        setConnected(true);
        // Subscribe to the public topic
        client.subscribe('/topic/public', (message) => {
          const chatMessage = JSON.parse(message.body);
          if (onMessageCallbackRef.current) {
            onMessageCallbackRef.current(chatMessage);
          }
        });

        // Tell the server about the new user
        client.publish({
          destination: '/app/chat.addUser',
          body: JSON.stringify({
            sender: username,
            type: 'JOIN'
          })
        });
      },
      onDisconnect: () => {
        setConnected(false);
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
        setConnected(false);
        if (onErrorCallbackRef.current) {
          onErrorCallbackRef.current('Connection error occurred');
        }
      },
      onWebSocketError: (event) => {
        console.error('WebSocket error: ', event);
        setConnected(false);
        if (onErrorCallbackRef.current) {
          onErrorCallbackRef.current('WebSocket connection error');
        }
      }
    });

    stompClientRef.current = client;
    client.activate();
  }, []);

  const disconnect = useCallback(() => {
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
      stompClientRef.current = null;
      setConnected(false);
    }
  }, []);

  const sendMessage = useCallback((content) => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify({
          sender: usernameRef.current,
          content: content,
          type: 'CHAT'
        })
      });
    }
  }, []);

  return {
    connect,
    disconnect,
    sendMessage,
    connected
  };
};
