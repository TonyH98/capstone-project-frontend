import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import User from "./User";
import { useUser } from "../contexts/UserProvider";
import useLocalStorage from "../hooks/useLocalStorage";

const API = process.env.REACT_APP_API_URL;

export default function Users() {
  const [users, setUsers] = useLocalStorage("users", []);
  const { loggedInUser, setLoggedInUser } = useUser();

  const [filterEvents, setFilterEvents] = useState([]);

  const [search, setSearch] = useState("");

  // useEffect makes get request for all Users
  useEffect(() => {
    axios
      .get(`${API}/users`)
      .then((res) => {
        setUsers(res.data);
        setFilterEvents(res.data);
      })
      .catch((c) => console.warn("catch, c"));
  }, []);

  useEffect(() => {
    if (search === "") {
      axios.get(`${API}/users`).then((res) => {
        setFilterEvents(res.data);
        setUsers(res.data);
      });
    } else {
      const filterUsers = users.filter((user) => {
        const { username } = user;

        const { email } = user;

        const usernameMatch = username
          .toLowerCase()
          .includes(search.toLowerCase());

        const emailMatch = email.toLowerCase().includes(search.toLowerCase());

        return usernameMatch || emailMatch;
      });

      setUsers(filterUsers);
    }
  }, [search]);

  console.log(users);

  // This is used to ensure that the loggedinuser is not shown
  const filteredUsers = users.filter((user) => user.id !== loggedInUser.id);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-semibold">All Users</h1>
      <div className="search-bar">
        <label htmlFor="search">Search</label>
        <input
          type="text"
          placeholder="Username or Email"
          id="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:w-96 rounded-md mx-1"
        />
      </div>
      <div className="flex flex-col gap-6 sm:w-full md:w-[65%] p-4">
        {/* {users.map((users) => (
          <User key={users.id} users={users} />
        ))} */}
        {filteredUsers.map((user) => (
          <User key={user.id} users={user} />
        ))}
      </div>
    </div>
  );
}
