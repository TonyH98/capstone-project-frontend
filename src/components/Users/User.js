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
    <div className="users-border-container">
      <div className="users-container-info">
        <img
          src={users?.profile_img}
          alt={`${users?.first_name} profile image`}
          className="h-[150px] w-40 rounded-l object-cover"
        ></img>
        <div className="users-card-name-container">
          <h3 className="users-card-name">
            {users?.first_name} {users?.last_name}
          </h3>
          <Link to={`/profile/${users?.username}`}>
            <h3 className="users-card-username">@{users?.username}</h3>
          </Link>
        </div>
      </div>
      <div className="users-card-friends-button-container">
      {loggedInUser?.id === users?.id ? null :
        <button
        onClick={() => navigate("/chats")}
        className="users-card-message-button"
      >
        <Link to="/chats">Message</Link>
      </button>}
    
      {loggedInUser?.id === users?.id ? null : friends ? (
        <span className="users-card-already-friends">Already Friends</span>
      ) : request && sendRequest ? (
        <span
        
          className="users-card-request-sent"
        >
        Request Sent
        </span>
      ) : (
        <button
          className="users-card-friends-button"
          onClick={sendFriendRequest}
        >
          Friend Request
        </button>
      )}
      </div>
    </div>
  );
}
