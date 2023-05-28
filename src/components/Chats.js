import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import useLocalStorage from "../hooks/useLocalStorage";

let socket;
const API = process.env.REACT_APP_API_URL;

function Chats({ loggedin, setLoggedin, user, firebaseId }) {
  // Before Login
  const [room, setRoom] = useState("");

  // After Login
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useLocalStorage('messageList', []);
  const [users, setUsers] = useLocalStorage('users', [])
  const [searchUser, setSearchUser] = useState("")

  useEffect(() => {
    socket = io(API);
  }, [API]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList([...messageList, data]);
    });
  });
  const connectToRoom = () => {
    setLoggedin(true);
    socket.emit("join_room", room);
  };

  const sendMessage = async () => {
    let messageContent = {
      room: room,
      content: {
        author: firebaseId,
        message: message,
      },
    };

    console.log(`User: ${JSON.stringify(user)}`);
    console.log(`Message: ${message}`);
    console.log(`Room: ${room}`)

    await socket.emit("send_message", messageContent);
    setMessageList([...messageList, messageContent.content]);
    setMessage("");
  };


     // useEffect makes get request for all Users
     useEffect(() => {
        axios
          .get(`${API}/users`)
          .then((res) => {
            setUsers(res.data);
            console.log(res.data);
        })
        .catch((c) => console.warn("catch, c"));
    }, []);

    const filterUsers = users.filter((user) => {
      const { first_name, last_name, username } = user;
      const usernameMatch = username.toLocaleLowerCase().includes(searchUser.toLocaleLowerCase());
      const firstNameMatch = first_name.toLocaleLowerCase().includes(searchUser.toLocaleLowerCase());
      const lastNameMatch = last_name.toLocaleLowerCase().includes(searchUser.toLocaleLowerCase());
      console.log(usernameMatch)

      return usernameMatch || firstNameMatch || lastNameMatch;
    })

  return (
    <div className="p-4">
      {!loggedin ? (
        <div className="text-center">
          <div className='search-bar'>
            <label htmlFor='search'>Search User: </label>
            <input
              type="text"
              placeholder='username'
              id='search'
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
        />
      </div>
          <div>No Conversations yet, search a user to start a conversation!</div>
        </div>
      ) : (
        <div className="flex gap-6 divide-x-4">
          <div className="text-2xl text-cyan-400 font-semibold p-4">Conversations</div>
          <div className="flex flex-col p-4">
            {messageList.map((val, key) => {
              return (
                <div
                  className="messageContainer"
                  id={val.author === firebaseId ? "You" : user.name}
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
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chats;
