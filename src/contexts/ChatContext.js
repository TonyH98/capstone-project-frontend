import React, { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const API = process.env.REACT_APP_BASE_URL

const socket = io(API); // Update with your server URL

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);
  const [currentContact, setCurrentContact] = useState('');
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    // Get contacts from the server
    socket.emit('get-contacts', (data) => {
      setContacts(data.contacts);
    });

    // Listen for incoming messages
    socket.on('receive-message', ({ sender, text }) => {
      setMessages((prevMessages) => [...prevMessages, { sender, text }]);
    });

    return () => {
      // Clean up event listeners
      socket.off('receive-message');
    };
  }, []);

  const handleSendMessage = () => {
    if (text.trim() === '') return;

    const recipients = [currentContact];
    socket.emit('send-message', { recipients, text });

    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'You', text },
    ]);

    setText('');
  };

  const chatContextValue = {
    contacts,
    currentContact,
    setCurrentContact,
    messages,
    text,
    setText,
    handleSendMessage,
  };

  return (
    <ChatContext.Provider value={chatContextValue}>
      {children}
    </ChatContext.Provider>
  );
};
