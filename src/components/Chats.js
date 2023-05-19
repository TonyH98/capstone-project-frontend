import React, { useContext } from 'react';
import { ChatContext } from '../contexts/ChatContext'

const Chats = () => {
  const {
    contacts,
    currentContact,
    setCurrentContact,
    messages,
    text,
    setText,
    handleSendMessage,
  } = useContext(ChatContext);

  const handleContactClick = (contact) => {
    setCurrentContact(contact);
  };

  return (
    <div>
      <h1>Chat App</h1>
      <div>
        <h2>Contacts</h2>
        <ul>
          {contacts.map((contact) => (
            <li
              key={contact}
              onClick={() => handleContactClick(contact)}
              style={{
                fontWeight: contact === currentContact ? 'bold' : 'normal',
              }}
            >
              {contact}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Messages with {currentContact}</h2>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>
              <strong>{message.sender}: </strong>
              {message.text}
            </li>
          ))}
        </ul>
        <div>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chats;
