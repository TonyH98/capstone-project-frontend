import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import useLocalStorage from "../hooks/useLocalStorage";

let socket;
const API = process.env.REACT_APP_API_URL;

function Chats({ loggedin, setLoggedin, user, setUser, firebaseId }) {
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useLocalStorage("messageList", []);
  const [users, setUsers] = useLocalStorage("users", []);
  const [searchUser, setSearchUser] = useState("");

  useEffect(() => {
    socket = io(API);
    socket.on("receive_message", (data) => {
      setMessageList((prevList) => [...prevList, data]);
    });
  }, [API]);

  const connectToRoom = () => {
    setLoggedin(true);
    socket.emit("join_room", room);
  };

  const sendMessage = () => {
    console.log(user);
    console.log(user.first_name);
    const messageContent = {
      room,
      content: {
        author: user.first_name,
        message,
      },
    };
    socket.emit("send_message", messageContent);
    setMessageList((prevList) => [...prevList, messageContent.content]);
    setMessage("");
  };

  useEffect(() => {
    axios
      .get(`${API}/users`)
      .then((res) => {
        setUsers(res.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const filterUsers = users.filter((user) => {
    const { first_name, last_name, username } = user;
    const usernameMatch = username
      .toLowerCase()
      .includes(searchUser.toLowerCase());
    const firstNameMatch = first_name
      .toLowerCase()
      .includes(searchUser.toLowerCase());
    const lastNameMatch = last_name
      .toLowerCase()
      .includes(searchUser.toLowerCase());

    return usernameMatch || firstNameMatch || lastNameMatch;
  });

  const handleRecipientSelection = (recipient) => {
    const newRoom = `${user.id}-${recipient.id}`;
    setRoom(newRoom);
    socket.emit("join_room", newRoom);
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-center">
        <label htmlFor="search">Search User: </label>
          <input
            type="text"
            placeholder="Username, First or Last name"
            id="search"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            className="w-96"
          />
      </div>
      {!user ? (
        <div className="text-center">
          <div>
            Log In or Create an account to start a conversation with other users!
          </div>
        </div>
      ) : (
        <div className="flex gap-6 divide-x-4">
          <div className="text-2xl text-cyan-400 font-semibold p-4">
            Conversations
          </div>
          <div className="flex flex-col p-4">
            {messageList.map((val, key) => {
              return (
                <div
                  className="messageContainer"
                  id={val.author === user.first_name ? "You" : user.first_name}
                  key={key}
                >
                  <div className="messageIndividual">
                    {val.author}: {val.message}
                  </div>
                </div>
              );
            })}
            <div className="absolute bottom-0 p-4">
              <input
                type="text"
                placeholder="Message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
        </div>
      )}
      <div>
        <h2>Users</h2>
        {users.map((recipient) => (
          <div
            key={recipient.id}
            onClick={() => handleRecipientSelection(recipient)}
          >
            {recipient.first_name}{" "}{recipient.last_name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Chats;