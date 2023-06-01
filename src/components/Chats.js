import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import io, { connect } from "socket.io-client";
import useLocalStorage from "../hooks/useLocalStorage";
import Global from "../utils/Global";
import { getUserInfo } from "../utils/appUtils";
import { BiSend } from "react-icons/bi"

let socket;
const API = process.env.REACT_APP_API_URL;

function Chats({ loggedin, setLoggedin, user, setUser, firebaseId }) {
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useLocalStorage("messageList", []);
  const [users, setUsers] = useLocalStorage("users", []);
  const [searchUser, setSearchUser] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [active, setActive] = useState(searchUser);

  let receiver;

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
        author: user.id,
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
    console.log(`selected one user: ${JSON.stringify(recipient)}`);
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
    <div className="p-4 flex flex-col gap-2">
      <div className="flex items-center justify-center">
        <label htmlFor="search" className="font-bold">Search User:</label>
          <input
            type="text"
            placeholder="Username, Firstname, Lastname"
            id="search"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            className="w-96 mx-2 rounded-md"
          />
      </div>
      <section className="flex">
      <div className="flex">
      {searchUser ? (
        <div className="flex gap-4">
        <div className="bg-cyan-100/50 rounded-md p-4 overflow-y-auto min-h-screen">
        <h2 className="text-2xl text-cyan-400 font-semibold py-2 px-4">Searched User</h2>
        {filterUsers.map((recipient) => (
          <div
            key={recipient.id}
            onClick={() => handleRecipientSelection(recipient)}
            className={`${active ? "bg-cyan-400" : ""} font-semibold py-1 flex gap-1`}
            >
            <span className="hidden">{receiver = JSON.stringify(recipient)}</span>
            {/* <span><img src={recipient.profile_img} alt="" className="w-10 rounded-full"></img></span> */}
            <span>{recipient.first_name[0].toUpperCase() + recipient.first_name.substring(1)}{" "}{recipient.last_name[0].toUpperCase() + recipient.last_name.substring(1)}</span>
          </div>
        ))}
      </div>
      </div>
      ) : (
        <div className="flex gap-4 mt-4">
        <div className="bg-cyan-100/50 rounded-md p-4 overflow-y-auto min-h-screen">
        <h2 className="text-2xl text-cyan-400 font-semibold py-2 px-4">Users</h2>
        {users.map((recipient) => (
          <div
            key={recipient.id}
            onClick={() => handleRecipientSelection(recipient)}
            className={`${active ? "bg-cyan-400" : ""} font-semibold py-1 px-4 flex gap-1`}
            >
            <span className="hidden">{receiver = JSON.stringify(recipient)}</span>
            {/* <span><img src={recipient.profile_img} alt="" className="w-10 rounded-full"></img></span> */}
            <span>{recipient.first_name[0].toUpperCase() + recipient.first_name.substring(1)}{" "}{recipient.last_name[0].toUpperCase() + recipient.last_name.substring(1)}</span>
          </div>
        ))}
      </div>
      </div>
      )}
      </div>
      <div className="flex-auto p-4 overflow-y-auto min-h-screen">
      {!Global.user ? (
        <div className="text-center">
          <div>
            Log In or Create an account to start a conversation with other users!
          </div>
        </div>
      ) : (
        <div className="flex gap-6 px-4 flex-auto ml-20 min-h-screen bg-cyan-100/50 rounded-md md:w-[450px] lg:w-[700px]">
          <div className="flex flex-col p-4">
            <article className="mb-auto">
            {messageList.map((val, key) => {
              return (
                <div
                  className={`my-1 flex flex-col ${val.author === receiver.id ? 'items-start' : 'self-end items-end'}`}
                  id={val.author === receiver.id ? receiver.first_name : "You"}
                  key={key}
                >
                  <div className={`rounded-md px-2 py-1 text-base  ${val.author === receiver.id ? 'bg-gray-300' : 'bg-cyan-500 text-slate-200'}`}>
                    {val.message}
                  </div>
                  <div className={`text-xs ${val.author === receiver.id ? '' : 'text-right'}`}>
                  {val.author === receiver.id ? receiver.first_name : "You"}
                  </div>
                </div>
              );
            })}
            </article>
            <div className="p-4 sticky flex">
              <input
                type="text"
                placeholder="Message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mx-2 w-96 rounded-md"
              />
              <button onClick={sendMessage} className="hover:text-cyan-400"><BiSend size={35}/></button>
            </div>
          </div>
        </div>
      )}
      </div>
      </section>
    </div>
  );
}

export default Chats;