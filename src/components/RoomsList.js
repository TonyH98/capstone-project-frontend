import React, { useEffect, useState } from "react";
import axios from "axios";
import socketIOClient from "socket.io-client";
import Room from "./Room";
import SendMessageForm from "./SendMessageForm";
const API = process.env.REACT_APP_API_URL;

function RoomsList({user, setUser, users, serUsers}) {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [chats, setChats] = useState([]);


  useEffect(() => {
    axios.get(`${API}/rooms/${user.id}`)
    .then((res) => {
      setRooms(res.data)
    })
  }, []);


  useEffect(() => {
    if (selectedRoom){
      axios.get(`${API}/rooms/${selectedRoom}/messages`)
      .then((res) => {
        setChats(res.data)
      })
    }
  }, [selectedRoom]);

  console.log(selectedRoom)
  console.log(chats)

  const handleRoomClick = (roomId) => {
    const socket = socketIOClient(API);
  
    // Leave the current room
    socket.emit("switch_room", null);
  
    // Join the new room
    socket.emit("switch_room", roomId);
  
    // Update the selected room state
    setSelectedRoom(roomId);
  
    console.log("This is the selected room:", roomId);
  
    // Listen for new messages in the current room
    socket.on("receive_message", (newMessage) => {
      // Update the UI with the new message
      console.log("Received new message:", newMessage);
    });
  
    // Listen for new room creation
    socket.on("new_room_created", (newRoom) => {
      // Update the room list and UI with the new room
      setRooms((prevRooms) => [...prevRooms, newRoom]);
      console.log("New room created:", newRoom);
    });
  };
  

  const handleCreateRoom = async (user2Id) => {
    try {
      const response = await axios.post(`${API}/rooms/${user.id}/new/${user2Id}`, {
        user1_id: user.id,
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
        console.log("Received new message:", newMessage);
      });

      console.log("New room created:", newRoom);
    } catch (error) {
      console.log(error);
    }
  };


  

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
      <article className="flex gap-6">
      <div>
      <h2>Rooms List</h2>
      <ul>
        {rooms.map((room) => (
            <section key={room.id}>
              <Room room={room} handleRoomClick={handleRoomClick}/>
            </section>
        ))}
      </ul>
      </div>
      <div className="flex items-center justify-center text-center">
      {selectedRoom && (
        <div className="flex flex-col items-center justify-center">
          <h2>Send Message</h2>
          <SendMessageForm selectedRoom={selectedRoom} />
        </div>
      )}
      </div>
      </article>
    </div>
  );
}

export default RoomsList;
