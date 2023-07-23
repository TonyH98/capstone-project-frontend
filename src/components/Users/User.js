import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserProvider";
import axios from "axios";
import "./User.css"

const API = process.env.REACT_APP_API_URL;

export default function User({ users }) {
  const navigate = useNavigate();

  const { loggedInUser } = useUser();
  const [request, setRequest] = useState(null);
  const [ friends, setFriends ] = useState(false);
  const [ sendRequest, setSendRequest ] = useState(false)
  function sendFriendRequest() {
    axios
      .post(`${API}/friends`, {
        users_id: users?.id,
        senders_id: loggedInUser?.id,
      })
      .then(() => {
        setRequest(true); // Update request state to indicate that the request was sent
        setSendRequest(true)
      });
  }

  useEffect(() => {
    if (loggedInUser?.id) {
      axios
        .get(`${API}/friends/${users?.id}/request?id=${loggedInUser?.id}`)
        .then((res) => {
          setRequest(res.data[0]);
        });
    }
  }, [loggedInUser?.id]);

  useEffect(() => {
    if (loggedInUser?.id) {
      axios
        .get(`${API}/friends/${users?.id}/list?id=${loggedInUser?.id}`)
        .then((res) => {
          setFriends(res.data[0]);
        });
    }
  }, [loggedInUser?.id]);

  return (
    <div className="users-card lg:bg-cyan-100 lg:shadow-lg lg:h-[150px] lg:rounded-md lg:flex lg:justify-between">
      <div className="users-card-info-container lg:flex">
        <img
          src={users?.profile_img}
          alt={`${users?.first_name} profile image`}
          className="users-card-profile-image lg:h-[150px] lg:w-40 lg:rounded-l lg:object-cover"
        ></img>
        <div className=" users-card-name-container lg:p-2">
          <h3 className=" users-card-fullname lg:font-semibold">
            {users?.first_name} {users?.last_name}
          </h3>
          <Link to={`/profile/${users?.username}`}>
            <h3 className="users-card-username lg:text-cyan-400 lg:font-bold lg:text-sm">@{users?.username}</h3>
          </Link>
        </div>
      </div>
      <div className="users-card-buttons-container lg:flex lg:justify-center lg:items-center lg:gap-4 lg:p-2">
      {loggedInUser?.id === users?.id ? null :
        <button
        onClick={() => navigate("/chats")}
        className="users-card-message-button lg:border-2 lg:border-cyan-400 lg:hover:bg-cyan-400 lg:px-2 lg:py-1.5 lg:rounded-md"
      >
        <Link to="/chats">Message</Link>
      </button>}
    
      {loggedInUser?.id === users?.id ? null : friends ? (
        <span className="lg:border-2 lg:border-cyan-400 lg:hover:bg-cyan-400 lg:px-2 lg:py-1.5 lg:rounded-md">Already Friends</span>
      ) : request && sendRequest ? (
        <span
        
          className="users-card-request-sent lg:border-2 lg:border-cyan-400 lg:bg-cyan-400 lg:px-2 lg:py-1.5 lg:w-[140px] lg:rounded-md"
        >
        Request Sent
        </span>
      ) : (
        <button
          className="users-card-friends-request-button lg:border-2 lg:border-cyan-400 lg:hover:bg-cyan-400 lg:px-2 lg:w-[140px] lg:py-1.5 lg:rounded-md"
          onClick={sendFriendRequest}
        >
          Friend Request
        </button>
      )}
      </div>
    </div>
  );
}