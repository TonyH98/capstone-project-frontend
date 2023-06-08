import React from "react";
import Room from "../components/Room";
import { useUser } from "../contexts/UserProvider";

export default function ShowRoom({ users, setUsers }) {
  // Sets and retrieves the user in local storage
  const { loggedInUser, setLoggedInUser } = useUser();

  return (
    <div>
      <Room />
    </div>
  );
}
