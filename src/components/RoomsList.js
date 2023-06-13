import React, { useEffect, useState } from "react";
import axios from "axios";
import socketIOClient from "socket.io-client";
import Room from "./Room";
import SendMessageForm from "./SendMessageForm";
import { AiOutlineSend } from "react-icons/ai"
import Lottie from "lottie-react";
import animationData from "../assets/startChat.json";
const API = process.env.REACT_APP_API_URL;

function RoomsList({users}) {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [roomByIndex , setRoomByIndex] = useState([])
  const [selectedUser,setSelectedUser] = useState(null)
  const [chat , setChat] = useState([])
  

  //Filtering users
  let [search , setSearch] = useState("")
  let [otherUsers , setOtherUsers] = useState([])
  let [filterUsers, setFilterUsers] = useState([])

  let otherUser = [roomByIndex["user1_id"],roomByIndex["user2_id"]].filter((users) => {
    return users !== users?.id
  })

  const [newChat, setNewChat] = useState({
    roomId: selectedRoom,
    user1_id: users?.id,
    user2_id: otherUser[0],
    content: ""
  });

useEffect(() => {
axios.get(`${API}/users`)
.then((res) => {
  const filter = res.data.filter((user) => {
    return user.id !== users.id 
  })

  setOtherUsers(filter)
})
}, [])

  useEffect(() => {
    
    if (otherUser[0]) {
      setNewChat((prevChat) => ({ ...prevChat, user2_id: otherUser[0] }));
    }
  }, [otherUser[0]]);
  

  useEffect(() => {
    
    if (selectedRoom) {
      setNewChat((prevChat) => ({ ...prevChat, roomId: selectedRoom }));
    }
  }, [selectedRoom]);



  
  useEffect(() => {
    axios.get(`${API}/rooms/${users.id}`)
    .then((res) => {
      setRooms(res.data)
    })
  }, []);
  
  useEffect(() => {
    if(selectedRoom){
      axios.get(`${API}/rooms/${selectedRoom}/messages`)
      .then((res) => {
        setChat(res.data)
      })

    }
  }, [selectedRoom]);


  useEffect(() => {
    if(selectedRoom){
      axios.get(`${API}/rooms/${selectedRoom}/selected`)
      .then((res) => {
        setRoomByIndex(res.data)
      })

    }
  }, [selectedRoom]);
  

  const handleRoomClick = (roomId) => {
    const socket = socketIOClient(API);
  
    // Leave the current room
    socket.emit("switch_room", null);
  
    // Join the new room
    socket.emit("switch_room", roomId);
  
    // Update the selected room state
    setSelectedRoom(roomId);
  
    // Listen for new messages in the current room
    socket.on("receive_message", (newMessage) => {
      // Update the UI with the new message
    });
  
    // Listen for new room creation
    socket.on("new_room_created", (newRoom) => {
      // Update the room list and UI with the new room
      setRooms((prevRooms) => [...prevRooms, newRoom]);
    });
  };
  

  const handleCreateRoom = async (user2Name) => {
    try {
      const response = await axios.post(`${API}/rooms/${users.username}/new/${user2Name}`, {
        username1: users.username,
        username2: user2Name
      });

      // Handle the created room
      const newRoom = response.data;
      setRooms((prevRooms) => [...prevRooms, newRoom]);
      setSelectedRoom(newRoom.id);

      const socket = socketIOClient(API);

      // Join the new room
      socket.emit("switch_room", newRoom.id);

      // Listen for new messages in the current room
      socket.on("receive_message", (newMessage) => {
        // Update the UI with the new message
      });
    } catch (error) {
    }
  };


//Create new chats

function handleNewMessage(newMessage) {
  axios
    .post(`${API}/rooms/${selectedRoom}/messages/${selectedRoom}`, newMessage)
    .then(() => {
      if (selectedRoom) {
        axios.get(`${API}/rooms/${selectedRoom}/messages`).then((res) => {
          setChat(res.data);
          console.log(res.data);
        });
      }
    });
}


const handleTextChange = (event) => {
    setNewChat({...newChat, content: event.target.value})
}


const handleSubmit = (event) => {
  event.preventDefault();
  handleNewMessage(newChat);
  setNewChat((prevChat) => ({ ...prevChat, content: "" }));
};


function handleFilter(event){
  let searchResult = event.target.value
    setSearch(searchResult)
    const filter = otherUsers.filter((friend) => {
      const {username} = friend
  

      const matchUsername = username.toLowerCase().includes(searchResult.toLowerCase())
  
      return  matchUsername
    })
  
    if(searchResult === ""){
      setFilterUsers([])
    }
    else{
      setFilterUsers(filter)
    }
}


  return (
    <div className="p-6 flex flex-col gap-2 bg-cyan-50">
      <div className="flex gap-2 justify-center items-center">
      <form
  onSubmit={(e) => {
    e.preventDefault();
    handleCreateRoom(e.target.user2Name.value);
  }}
>
  <input
    type="text"
    name="user2Name"
    placeholder="Search Username"
    value={search}
    onChange={handleFilter}
    required
    className="rounded-l sm:w-96 focus:border-transparent focus:ring-0"
  />
  <button type="submit" className=" bg-cyan-400 px-4 py-2 shadow-md rounded-r border border-cyan-400">Chat</button>
  {filterUsers.length !== 0 && (
    <div className="data=result">
      {filterUsers.slice(0, 5).map((users) => {
        return (
          <div
            className="search"
            onClick={() => {
              document.getElementsByName("user2Name")[0].value =
                users.username;
            }}
            key={users.username}
          >
            <section className="bg-white min-h-[100px] shadow-md rounded-lg absolute w-96 p-2">{users.username}</section>
          </div>
        );
      })}
    </div>
  )}
</form>
      </div>
      <article className="flex gap-4">
      <div className="border-r">
        <h2 className="text-2xl text-cyan-400">Conversations</h2>
        <ul className="">
          {rooms.map((room) => (
            <section key={room.id}>
              {/* <p>{room.username}</p> */}
              <Room room={room} handleRoomClick={handleRoomClick} selectedRoom={selectedRoom}/>
            </section>
          ))}
        </ul>
      </div>
      <div className="flex flex-col p-4 ml-[12%] min-w-[45vw] min-h-[70vh]">
  {Array.isArray(chat) ? (
    chat.map((chatItem) => (
      <div key={chatItem.id} className={`my-1 flex flex-col p-2 rounded-md w-52 ${users?.id === chatItem.userid ? 'self-end items-start bg-cyan-400' : 'items-start bg-[#f6854b]'}`} >
        <section >
        <p className="text-xs">{chatItem.date_created}</p>
        <p className="font-semibold">{chatItem.content}</p>
        <div className="text-xs">{users?.id === chatItem.userid ? "You" : chatItem.username}</div>
        </section>
      </div>
    ))
  ) : (
    <div className='w-[70%] flex flex-col justify-center items-center'>
      <h2 className="font-bold text-base">No conversation yet, send a message to get started!</h2>
      <Lottie animationData={animationData} />
    </div>
  )}
</div>
      </article>
{selectedRoom ? 
<form onSubmit={handleSubmit} className="flex justify-center items-center">
      <input
      type="text"
      id="content"
      value={newChat.content}
      placeholder="Message..."
      onChange={handleTextChange}
      className="rounded-md sm:w-96 border-2 border-black"
      />
     <button type="submit" className="mx-1 hover:text-cyan-400 font-bold"><AiOutlineSend size={30}/></button>
      </form>: null
}
    </div>
  );
}

export default RoomsList;
