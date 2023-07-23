import React from "react";
import {  useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import User from "./User";
import "./Users.css"
import { useUser } from "../../contexts/UserProvider";
import useLocalStorage from "../../hooks/useLocalStorage";

const API = process.env.REACT_APP_API_URL;

export default function Users() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const { loggedInUser, setLoggedInUser } = useUser();
  const [filterUsers,setFilteredUsers] = useState([])
  const [category , setCategory] = useState({})
  const location = useLocation()

  const queryParams = new URLSearchParams(location.search);
  const categoryFilter = queryParams.get('categories.category_id')


  
  // useEffect makes get request for all Users
  useEffect(() => {
    let filteredUsers = users;
  
    if (search) {
      const searchQuery = search.toLowerCase();
      filteredUsers = users.filter((user) => {
        const { username, first_name, last_name, email } = user;
        const fullName = `${first_name.toLowerCase()} ${last_name.toLowerCase()}`;
  
        return (
          username.toLowerCase().includes(searchQuery) ||
          email.toLowerCase().includes(searchQuery) ||
          fullName.includes(searchQuery)
        );
      });
    }
  
    setFilteredUsers(filteredUsers); // Store the filtered users separately
  
  }, [search, users]);
  
  useEffect(() => {
    if (categoryFilter) {
      axios
        .get(`${API}/users`, {
          params: { 'categories.category_id': categoryFilter },
        })
        .then((res) => {
          setUsers(res.data);
          setFilteredUsers(res.data)
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      axios
        .get(`${API}/users`)
        .then((res) => {
          setUsers(res.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [categoryFilter]);
  

  useEffect(() => {
    if(categoryFilter){
      axios
      .get(`${API}/category/${categoryFilter}`)
      .then((res) => {
        setCategory(res.data)
      })
    }
  }, [categoryFilter])

  // This is used to ensure that the loggedinuser is not shown
  const filteredUsers = filterUsers.filter((user) => user.id !== loggedInUser.id);

  return (
    <div className="users-container lg:flex lg:flex-col lg:items-center lg:justify-center lg:p-4">
      <h1 className=" users-page-header lg:text-2xl lg:text-gray-700 lg:font-semibold">
        {categoryFilter ? `Users: ${category.name}` : `All Users`}
      </h1>
      <div className="users-search-bar-container">
        <label htmlFor="search">Search</label>
        <input
          type="text"
          placeholder="Username or Email or Full Name"
          id="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className=" users-search-bar lg:w-96 lg:rounded-md lg:mx-1 lg:shadow-md lg:py-2 lg:px-1 lg:my-2 lg:ml-2 lg:pl-4"
        />
      </div>
      <div className="users-card-container lg:flex lg:flex-col lg:gap-6 lg:w-[800px] p-4">
        {filteredUsers.map((user) => (
          <User key={user.id} users={user} />
        ))}
      </div>
    </div>
  );
}