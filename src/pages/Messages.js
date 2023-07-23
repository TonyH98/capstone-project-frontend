import React from "react";
import RoomsList from "../components/Chat/RoomsList";
import { useUser } from "../contexts/UserProvider";
// I added in the local storage user so you dont need to pass down so many states, a UsersProvider needs to be made for users to be on local storage

const Messages = ({ users, setUsers }) => {
  // Sets and retrieves the user in local storage
  const { loggedInUser, setLoggedInUser } = useUser();

  return (
    <div>
      <RoomsList users={users} setUsers={setUsers} />
    </div>
  );
};

export default Messages;
