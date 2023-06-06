import React, { useEffect, useState } from "react";
import axios from "axios";
import socketIOClient from "socket.io-client";
import Room from "./Room";
const API = process.env.REACT_APP_API_URL;

function RoomsList({user, setUser, users, serUsers}) {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  function handleSelectedUser (recipient) {
    console.log(`selected one user: ${JSON.stringify(recipient)}`);
    setSelectedUser(recipient);
  }

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${API}/rooms`);
      setRooms(response.data);
      console.log(response.data);
      console.log("this is user:", user);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRoomClick = (roomId, user2Id) => {

    // try {
    //   const response = await axios.get(`${API}/rooms/${user?.id}/${user2Id}`);
    // }
    setSelectedRoom(roomId);

    console.log("This is the selected room:", selectedRoom);

    const socket = socketIOClient(API);
    
      // Join the initial room(s)
      socket.emit("switch_room", roomId);

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
    <div className="p-6">
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
      <h2>Rooms List</h2>
      <ul>
        {rooms.map((room) => (
            <section key={room.id}>
              {/* <p>{room.username}</p> */}
              <Room room={room} handleRoomClick={handleRoomClick}/>
            </section>
        ))}
      </ul>
    </div>
  );
}

export default RoomsList;
