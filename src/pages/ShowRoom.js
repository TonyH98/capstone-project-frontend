import React from "react";
import RoomsList from "../components/Chat/RoomsList";


export default function ShowRoom({ users }) {
  // Sets and retrieves the user in local storage
  

  return (
    <div>
      <RoomsList users={users} />
    </div>
  );
}
