import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import io, { connect } from "socket.io-client";
import useLocalStorage from "../hooks/useLocalStorage";
import Global from "../utils/Global";
import { getUserInfo } from "../utils/appUtils";

let socket;
const API = process.env.REACT_APP_API_URL;

function Chats({ loggedin, setLoggedin, user, setUser, firebaseId }) {
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useLocalStorage("messageList", []);
  const [users, setUsers] = useLocalStorage("users", []);
  const [searchUser, setSearchUser] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);

  //This is not working, messages not being sent
  // useEffect(() => {
  //   socket = io(API);
  //   socket.on("receive_message", (data) => {
  //     console.log('received = ', data);
  //     setMessageList((prevList) => [...prevList, data]);
  //   });

  //   connectToRoom();
  // }, [API]);

  const onReceiveMessage = (data) => {
    console.log('received = ', data);
    setMessageList((prevList) => [...prevList, data]);
  };

  useEffect(() => {
    let userInfo = getUserInfo();

    console.log('user info ===== ', userInfo);

    if (Global.user) {
      console.log('call here---', Global.user.id);   
      socket = io(API);
      socket.on("receive_message", onReceiveMessage);


      let strRoom = `user_${Global.user.id}`;

      connectToRoom(strRoom);

      return () => {
        socket.off('receive_message', onReceiveMessage);
      }
    } else {
      alert("please login first");
    }
  }, []);

  const connectToRoom = (strRoom) => {
    setLoggedin(true);

    socket.emit("join_room", strRoom);
  };

  const sendMessage = () => {

    if (!selectedUser) {
      alert("Please select user");
      return;
    }


    // console.log(user);
    // console.log(user.first_name);

    let strRoom = `user_${selectedUser.id}`;
    const messageContent = {
      room: strRoom,
      content: {
        author: user.first_name,
        message,
      },
    };

    console.log('message content = ', messageContent);
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
    console.log(`selected one user: ${recipient.id}`);
    setSelectedUser(recipient);
    // const newRoom = `${user.id}-${recipient.id}`;
    // setRoom(newRoom);
    // console.log(`Coming from: ${user.first_name}`);
    // console.log(`Going to: ${recipient.id}`);
    // console.log(`In room: ${room}`);
    // socket.emit("join_room", newRoom);
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