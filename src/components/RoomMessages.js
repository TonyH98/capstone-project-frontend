import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
const API = process.env.REACT_APP_API_URL;

function RoomMessages({ roomId }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const socket = socketIOClient(API);

    socket.emit("switch_room", roomId);

    socket.on("receive_message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  return (
    <div>
      <h2>Room Messages</h2>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>{message.content}</li>
        ))}
      </ul>
    </div>
  );
}

export default RoomMessages;
