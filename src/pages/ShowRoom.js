import React from "react";
import RoomsList from "../components/RoomsList";
<<<<<<< HEAD


export default function ShowRoom({ users }) {
  // Sets and retrieves the user in local storage
  

  return (
    <div>
      <RoomsList users={users} />
=======


export default function ShowRoom({user}) {


  return (
    <div>
      <RoomsList user={user}/>
>>>>>>> 1baa7d6 (All issues in dev resolved)
    </div>
  );
}
