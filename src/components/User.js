import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserProvider";
import axios from "axios";

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
    <div className="bg-cyan-100 shadow-lg h-[150px] rounded-md flex justify-between">
      <div className="flex">
        <img
          src={users?.profile_img}
          alt={`${users?.first_name} profile image`}
          className="h-[150px] w-40 rounded-l object-cover"
        ></img>
        <div className="p-2">
          <h3 className="font-semibold">
            {users?.first_name} {users?.last_name}
          </h3>
          <Link to={`/profile/${users?.username}`}>
            <h3 className="text-cyan-400 font-bold text-sm">@{users?.username}</h3>
          </Link>
        </div>
      </div>
      <div className="flex justify-center items-center gap-4 p-2">
      {loggedInUser?.id === users?.id ? null :
        <button
        onClick={() => navigate("/chats")}
        className=" border-2 border-cyan-400 hover:bg-cyan-400 px-2 py-1.5 rounded-md"
      >
        <Link to="/chats">Message</Link>
      </button>}
    
      {loggedInUser?.id === users?.id ? null : friends ? (
        <span className="border-2 border-cyan-400 hover:bg-cyan-400 px-2 py-1.5 rounded-md">Already Friends</span>
      ) : request && sendRequest ? (
        <span
          onClick={() => setSendRequest(false)}
          className="border-2 border-cyan-400 bg-cyan-400 px-2 py-1.5 w-[140px] rounded-md"
        >
          Cancel Request
        </span>
      ) : (
        <button
          className="border-2 border-cyan-400 hover:bg-cyan-400 px-2 w-[140px] py-1.5 rounded-md"
          onClick={sendFriendRequest}
        >
          Friend Request
        </button>
      )}
      </div>
    </div>
  );
}
