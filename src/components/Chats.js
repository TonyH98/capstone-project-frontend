import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import io, { connect } from "socket.io-client";
import useLocalStorage from "../hooks/useLocalStorage";
import Global from "../utils/Global";
import { getMessageListByUserId, getUserInfo, saveMessageByUserId } from "../utils/appUtils";
import { BiSend } from "react-icons/bi"

let socket;
const API = process.env.REACT_APP_API_URL;

function Chats({ loggedin, setLoggedin, user, setUser, firebaseId }) {
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  // const [messageList, setMessageList] = useLocalStorage("messageList", []);
  const [messageList, setMessageList] = useState([]);

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


  const onLoadMessageList = (user_id) => {
    // get from backend server

    axios.post(`${API}/chats?sender_id${user_id}&receiver_id=${Global.user?.id}`)
          .then((res) => {
              console.log('resu ==== ', res.data);
            
              let data = res.data ?? [];

              setMessageList([...data]);
            })
  }

  const onReceiveMessage = (data) => {
    console.log('received = ', data);

    // check existing
    let checkItem = messageList.filter((item) => item.id === data.id);

    if (checkItem) {
      return;
    }

    setMessageList([...messageList, data]);
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
    // setLoggedin(true);

    socket.emit("join_room", strRoom);
  };

  const sendMessage = () => {
    if (!receiver) {
      alert("Please select user");
      return;
    }
<<<<<<< Updated upstream

    console.log('selected user = ', selectedUser);
    // return;


    // console.log(user);
    // console.log(user.first_name);

    let strRoom = `user_${selectedUser.id}`;
    const messageContent = {
      sender_id: Global.user?.id,
      receiver_id: selectedUser.id,
      content: message,
=======
  
    const messageContent = {
      room: `user_${receiver.id}`,
      content: {
        author: user.id,
        message,
      },
>>>>>>> Stashed changes
    };

    console.log('message content = ', messageContent);
    socket.emit("send_message", messageContent);
    
    // // save to local storage
    // let tempMessageList = saveMessageByUserId(selectedUser?.id, messageContent.content);

    // setMessageList([...tempMessageList]);
    // setMessageList((prevList) => [...prevList, messageContent.content]);
    setMessage("");
  };

  

  useEffect(() => {
    axios
      .get(`${API}/users`)
      .then((res) => {
        setUsers(res.data);

        if (res.data?.length > 0) {
          setSelectedUser(res.data[0]);
          onLoadMessageList(res.data[0]?.id);
        }
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

    onLoadMessageList(recipient.id);
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
            onClick={() => {
              handleRecipientSelection(recipient);
              setSelectedUser(recipient);
            }}
            className={`font-semibold py-1 flex gap-1 ${selectedUser && selectedUser.id === recipient.id ? 'bg-cyan-400' : ''}`}
          >
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
        {users.map((recipient, recipientKey) => (
          Global.user?.id === recipient.id ? null :
          <div
            key={recipientKey}
            onClick={() => handleRecipientSelection(recipient)}
            className={`${active ? "bg-cyan-400" : ""} font-semibold py-1 px-4 flex gap-1`}
            style={{cursor: 'hand', color: selectedUser?.id === recipient.id ? 'red' : 'black'}}
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
<<<<<<< Updated upstream
            <article className="mb-auto">
            {messageList.map((messageItem, key) => {
              return (
                <div
                  className={`my-1 flex flex-col ${messageItem.author === receiver.id ? 'items-start' : 'self-end items-end'}`}
                  id={messageItem.sender_id === receiver.id ? receiver.first_name : "You"}
                  key={key}
                >
                  <div className={`rounded-md px-2 py-1 text-base  ${messageItem.author === receiver.id ? 'bg-gray-300' : 'bg-cyan-500 text-slate-200'}`}>
                    {messageItem.content}
                  </div>
                  <div className={`text-xs ${messageItem.author === receiver.id ? '' : 'text-right'}`}>
                  {messageItem.sender_id === receiver.id ? receiver.first_name : "You"}
=======
          <article className="mb-auto">
            {messageList.map((val, key) => {
              return (
                <div
                  className={`my-1 flex flex-col ${val.author === user.id ? 'items-end' : 'items-start'}`}
                  key={key}
                >
                  <div className={`rounded-md px-2 py-1 text-base ${val.author === user.id ? 'bg-cyan-500 text-slate-200' : 'bg-gray-300'}`}>
                    {val.message}
                  </div>
                  <div className={`text-xs ${val.author === user.id ? 'text-right' : ''}`}>
                    {val.author === user.id ? receiver.first_name : 'You'}
>>>>>>> Stashed changes
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