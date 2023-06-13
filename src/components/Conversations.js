import React, { useState} from 'react'
import axios from 'axios';
const API = process.env.REACT_APP_API_URL;

export default function Conversations({setSelectedUser, setRoom, setMessageList}) {
    const [conversations, setConversations] = useState([]);

    const handleConversationClick = (recipient) => {
        setSelectedUser(recipient);
        const strRoom = `user_${recipient.id}`;
        setRoom(strRoom);
        // Fetch previous messages for the conversation
        axios
          .get(`${API}/chats/${strRoom}`)
          .then((res) => {
            setMessageList(res.data);
          })
          .catch((error) => {
            console.error("Error fetching messages:", error);
          });
      };
  return (
    <div>Conversations</div>
  )
}
