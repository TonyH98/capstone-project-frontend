import React, { useEffect, useState, useCallback  } from "react";
import axios from "axios";
import socketIOClient from "socket.io-client";
import Room from "./Room";
import { AiOutlineSend } from "react-icons/ai"
import Lottie from "lottie-react";
import animationData from "../assets/startChat.json";
import NoSelection from "../assets/findSelected.json"
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
  const [closeSearch, setCloseSearch] = useState(false)


  // handle page scroll
  const setRef = useCallback(node => {
    if (node) {
      node.scrollIntoView({ smooth: true })
    }
  }, [])

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
      
      axios.get(`${API}/rooms/${users.id}`)
        .then((res) => {
          setRooms(res.data)
        })

        setFilterUsers([]);
        setSearch('');

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
  console.log("new chat", newChat)
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
      setFilterUsers([]);
    }
    else{
      setFilterUsers(filter)
    }
}



return (
  <div className="lg:p-6 lg:flex lg:flex-col lg:gap-2 lg:bg-cyan-50">
      <div className="lg:flex lg:gap-2 lg:justify-center lg:items-center">
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
    className="lg:rounded-l lg:py-2 lg:px-2 lg:border lg:border-black lg:w-96 lg:focus:border-transparent lg:focus:ring-0"
  />
  <button type="submit" className="lg:bg-cyan-400 lg:px-4 lg:py-2 lg:shadow-md lg:rounded-r lg:border lg:border-gray-800  lg:hover:border-cyan-400">Chat</button>
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
            <section className="lg:z-20 lg:bg-white lg:min-h-[100px] lg:shadow-md lg:rounded-lg lg:absolute lg:w-96 lg:p-2">{users.username}</section>
          </div>
        );
      })}
    </div>
  )}
</form>
      </div>
      <article className="lg:flex lg:gap-4">
      <div className="lg:border-r lg:px-3">
        <h2 className="lg:text-2xl lg:text-cyan-400">Conversations</h2>
        <ul className="">
          {rooms.map((room) => (
            <section key={room.id}>
              {/* <p>{room.username}</p> */}
              <Room room={room} handleRoomClick={handleRoomClick} selectedRoom={selectedRoom}/>
            </section>
          ))}
        </ul>
      </div>
      <div className="lg:flex lg:flex-col lg:p-4 lg:ml-[12%] lg:w-[45vw] lg:h-[68vh] lg:overflow-y-auto">
  {Array.isArray(chat) ? (
    chat.map((chatItem, index) => {
      const lastMessage = chat.length - 1 === index;
      return (
      <div key={chatItem.id} ref={lastMessage ? setRef : null} className={`lg:my-1 lg:flex lg:flex-col lg:p-2 lg:rounded-md lg:w-72 ${users?.id === chatItem.userid ? 'lg:self-end lg:items-start lg:bg-cyan-300' : 'lg:items-start lg:bg-[#ffbb00]'}`} >
        <section >
        <p className="lg:text-xs">{chatItem.date_created}</p>
        <p className="lg:font-semibold">{chatItem.content}</p>
        <div className="lg:text-xs lg:text-muted">{users?.id === chatItem.userid ? "You" : chatItem.username}</div>
        </section>
      </div>
    )})
  ) : (
    <div className='lg:w-[75%] lg:flex lg:flex-col lg:justify-center lg:items-center lg:ml-14'>
      <h2 className="lg:font-bold lg:text-base lg:text-center">No conversation yet, send a message to get started!</h2>
      <Lottie animationData={animationData} />
    </div>
  )}
</div>
      </article>
{selectedRoom ? 
(<form onSubmit={handleSubmit} className="lg:flex lg:justify-center lg:items-center">
      <input
      type="text"
      id="content"
      value={newChat.content}
      placeholder="Message..."
      onChange={handleTextChange}
      className="lg:rounded-md lg:sm:w-96 lg:border-2 lg:border-slate-800 lg:px-1 lg:py-2 lg:focus:border lg:focus:border-cyan-400"
      />
     <button type="submit" className="lg:mx-1 lg:hover:text-cyan-400 lg:font-bold"><AiOutlineSend size={30}/></button>
      </form>) : (
        <div className="lg:absolute lg:top-[25%] lg:w-[85%] lg:flex lg:flex-col lg:justify-center lg:items-center">
          <h2 className="lg:font-bold lg:text-base lg:text-center">No Conversation selected</h2>
          {/* <Lottie animationData={NoSelection} /> */}
        </div>
      )
}
    </div>
  );
}

export default RoomsList;
