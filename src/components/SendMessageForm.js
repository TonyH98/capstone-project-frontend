import React, { useState } from "react";
import axios from "axios";
const API = process.env.REACT_APP_API_URL;

function SendMessageForm({ selectedRoom }) {
  const [message, setMessage] = useState("");

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (message.trim() === "") {
      return;
    }

    try {
      const response = await axios.post(
        `${API}/rooms/${selectedRoom}`,
        {
          room_id: selectedRoom,
          message: message.trim(),
        }
      );

      console.log("Message sent:", response.data);

      // Reset the input field after sending the message
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSendMessage}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        required
      />
      <button type="submit">Send</button>
    </form>
  );
}

export default SendMessageForm;
