import React, { useEffect, useState } from "react";
import axios from "axios";
import socketIOClient from "socket.io-client";
import Room from "./Room";
import SendMessageForm from "./SendMessageForm";
const API = process.env.REACT_APP_API_URL;

function RoomsList({users}) {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [roomByIndex , setRoomByIndex] = useState([])
  const [selectedUser,setSelectedUser] = useState(null)
  const [chat , setChat] = useState([])
  
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
  

  const handleCreateRoom = async (user2Id) => {
    try {
      const response = await axios.post(`${API}/rooms/${users.id}/new/${user2Id}`, {
        user1_id: users.id,
        user2_id: user2Id
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






console.log(newChat)




  return (
    <div className="p-6 flex flex-col">
      <div className="">
      <h2>Create Room</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateRoom(e.target.user2Id.value);
        }}
      >
        <input type="text" name="user2Id" placeholder="User ID" required />
        <button type="submit">Create Room</button>
      </form>
      </div>
      <h2>Rooms List</h2>
      <ul>
        {rooms.map((room) => (
            <section key={room.id}>
              {/* <p>{room.username}</p> */}
              <Room room={room} handleRoomClick={handleRoomClick} selectedRoom={selectedRoom}/>
            </section>
        ))}
      </ul>
      <div>
  {Array.isArray(chat) ? (
    chat.map((chatItem) => (
      <div key={chatItem.id}>
        <p>{chatItem.date_created}</p>
        <p>{chatItem.content}</p>
        <div>{users?.id === chatItem.userid ? "You" : chatItem.username}</div>

     

      </div>
    ))
  ) : (
    <div>
      <p>No chat available</p>
    </div>
  )}
</div>
{selectedRoom ? 
<form onSubmit={handleSubmit}>
      <input
      type="text"
      id="content"
      value={newChat.content}
      onChange={handleTextChange}
      />
     <input type="submit"/>
      </form>: null

}

    </div>
  );
}

export default RoomsList;
