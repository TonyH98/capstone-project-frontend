import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../Kick.it Logo.png";
import { RiHomeLine } from "react-icons/ri";
import { HiOutlineUsers } from "react-icons/hi";
import { FiMessageCircle } from "react-icons/fi";
import { MdNotificationsNone } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useUser } from "../contexts/UserProvider";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "../utils/appUtils";
import "./NavBar.css";
import axios from "axios";
import app from "../firebase";
import { Modal, Toggle, Button, ButtonToolbar, Placeholder } from 'rsuite';

const API = process.env.REACT_APP_API_URL;

export default function NavBar({ setUser, setLoggedIn, loggedin }) {
  const navigate = useNavigate();

  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 450px)").matches
  );
  const [active, setActive] = useState(0);
  const [friendsRequest, setFriendRequest] = useState([]);

  const { loggedInUser } = useUser();
  const auth = getAuth(app);

  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    window
      .matchMedia("(min-width: 450px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);

  let dropdownText;
  if (loggedin) {
    dropdownText = `${loggedInUser.username}`;
  } else {
    dropdownText = "Login";
  }

  // Need to add setting the user to a blank object and loggedIn to false after states are properly being passed
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        setUser({});
        setLoggedIn(false);
        console.log("signed out");
        navigate(`/`);
      })
      .catch((error) => {
        // An error happened.
      });
  };

  const userInfo = getUserInfo();

  // useEffect(() => {
  //   if (loggedInUser?.id) {
  //     axios.get(`${API}/friends/${loggedInUser?.id}/request`).then((res) => {
  //       setFriendRequest(res.data.length);
  //       console.log("friends data:", res.data);
  //       console.log("friends data length:", res.data.length);
  //     });
  //   }
  // }, [loggedInUser?.id]);

  useEffect(() => {
    if (loggedInUser?.id) {
      axios.get(`${API}/friends/${loggedInUser?.id}/request`).then((res) => {
        setFriendRequest(res.data);
      });
    }
  }, [loggedInUser?.id]);

  const acceptRequest = (senderId) => {
    axios
      .post(`${API}/friends/${loggedInUser?.id}/accept/${senderId}`, {
        users_id: loggedInUser?.id,
        friends_id: senderId,
      })
      .then(() => {
        axios.get(`${API}/friends/${loggedInUser?.id}/request`).then((res) => {
          setFriendRequest(res.data);
        });
      });
  };

  const declineRequest = (senderId) => {
    axios
      .delete(`${API}/friends/${loggedInUser?.id}/denied/${senderId}`)
      .then(() => {
        axios.get(`${API}/friends/${loggedInUser?.id}/request`).then((res) => {
          setFriendRequest(res.data);
        });
      })
      .catch((error) => {
        console.error("Error declining friend request:", error);
      });
  };

  return (
    <nav className="flex items-center justify-between h-20 sticky blob bg-opacity-60 bg-gradient-to-r from-purple-300 via-purple-100 to-cyan-400 z-50">
      <Link to="/">
        <img src={logo} alt="logo" className="h-20"></img>
      </Link>
      {matches && (
        <div className="flex items-center justify-between h-20 sticky z-50">
          {loggedin && (
            <ul className="flex justify-center items-center gap-8 font-semibold text-[12px]">
              <li
                onClick={() => setActive(0)}
                className={`${
                  active === 0 ? "bg-cyan-400" : "bg-cyan-200"
                } rounded-full p-2 shadow-lg`}
              >
                <Link
                  to="/events"
                  className="group"
                  aria-current="page"
                >
                  <span className="flex flex-col items-center justify-center group-hover:text-white">
                    <RiHomeLine size={20} />
                  </span>
                  <span className="text-gray-900 group-hover:text-white">Events</span>
                </Link>
              </li>
              <li
                onClick={() => setActive(1)}
                className={`${
                  active === 1 ? "bg-cyan-400" : "bg-cyan-200"
                } rounded-full p-2 shadow-lg`}
              >
                <Link
                  to="/users"
                  className="group"
                  aria-current="page"
                >
                  <span className="flex flex-col items-center justify-center group-hover:text-white">
                    <HiOutlineUsers size={20} />
                  </span>
                  <span className="text-gray-900 group-hover:text-white mx-0.5">Users</span>
                </Link>
              </li>
              <li
                onClick={() => setActive(2)}
                className={`${
                  active === 2 ? "bg-cyan-400" : "bg-cyan-200"
                } rounded-full p-2 shadow-lg`}
              >
                <Link to="/chats" className="group" aria-current="page">
                  <span className="flex flex-col items-center justify-center group-hover:text-white">
                    <FiMessageCircle size={20} />
                  </span>
                  <span className="text-gray-900 group-hover:text-white mx-0.5">Chats</span>
                </Link>
              </li>
              <li
                onClick={() => setActive(3)}
                className={`${
                  active === 3 ? "bg-cyan-400" : "bg-cyan-200"
                } rounded-full p-2 shadow-lg`}
              >
                <div
                  className="group"
                  aria-current="page"
                  onClick={handleOpen}
                >
                  <span className="flex flex-col items-center justify-center group-hover:text-white">
                    <IoMdNotificationsOutline size={20} />
                  </span>
                  <span className="text-gray-900 hover:text-white">
                    Inbox
                  </span>
                </div>
              </li>
            </ul>
          )}
        </div>
      )}
      {open && (
                <div overflow={overflow} open={open} onClose={handleClose} className=" z-50 absolute top-[100%] right-[30%] my-2  w-[35%] h-[60vh] bg-white shadow-2xl rounded-md">
                  <section>
                    <button onClick={handleClose} className="font-semibold p-2 absolute right-0">
                      X
                    </button>
                    <h2 className="text-2xl text-cyan-400 text-center">Inbox</h2>
                    <div className="p-4 flex flex-col gap-3">
                    {friendsRequest[0] ? (
                    friendsRequest.map((request) => {
                      return (
                        <div key={request.id} className="flex justify-between items-center bg-purple-50 p-2 rounded-md shadow-md overflow-y-auto">
                          <div>
                            <img
                              src={request?.profile_img}
                              alt="profile-pic"
                              className="w-10 h-10 rounded-full"
                            />
                            <p className="text-sm font-semibold">{request.first_name} {request.last_name}</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => acceptRequest(request.id)} className="text-xs text-white bg-indigo-500 hover:bg-blue-800 hover:font-semibold p-1 rounded-md">
                              Accept
                            </button>
                            <button onClick={() => declineRequest(request.id)} className="text-xs text-white bg-red-400 hover:bg-red-500 hover:font-semibold p-1 rounded-md">
                              Decline
                            </button>
                          </div>
                        </div>
                      );
                    })) : (
                      <p className="ml-5 py-3 text-gray-400 flex justify-center">No friend requests.</p>
                    )}
                    </div>
                  </section>
                </div>
              )}
      {!matches && (
        <div className="navbar blob bg-opacity-60 bg-gradient-to-r from-purple-300 via-purple-200 to-cyan-600 z-50 shadow-lg">
          {loggedin && (
            <ul className="flex justify-center items-center gap-8 font-semibold text-[12px]">
              <li
                onClick={() => setActive(0)}
                className={`${
                  active === 0 ? "bg-cyan-400" : "bg-cyan-200"
                } rounded-full p-2 shadow-lg`}
              >
                <Link
                  to="/events"
                  className="hover:text-white"
                  aria-current="page"
                >
                  <span className="flex flex-col items-center justify-center">
                    <RiHomeLine size={20} />
                  </span>
                  <span className="text-gray-900 hover:text-white">Events</span>
                </Link>
              </li>
              <li
                onClick={() => setActive(1)}
                className={`${
                  active === 1 ? "bg-cyan-400" : "bg-cyan-200"
                } rounded-full p-2 shadow-lg`}
              >
                <Link
                  to="/users"
                  className="hover:text-white"
                  aria-current="page"
                >
                  <span className="flex flex-col items-center justify-center">
                    <HiOutlineUsers size={20} />
                  </span>
                  <span className="text-gray-900 hover:text-white">Users</span>
                </Link>
              </li>
              <li
                onClick={() => setActive(2)}
                className={`${
                  active === 2 ? "bg-cyan-400" : "bg-cyan-200"
                } rounded-full p-2 shadow-lg`}
              >
                <Link to="/chats" className="" aria-current="page">
                  <span className="flex flex-col items-center justify-center">
                    <FiMessageCircle size={20} />
                  </span>
                  <span className="text-gray-900">Chats</span>
                </Link>
              </li>
              <li
                onClick={() => setActive(3)}
                className={`${
                  active === 3 ? "bg-cyan-400" : "bg-cyan-200"
                } rounded-full p-2 shadow-lg`}
              >
                <Link
                  to={`/personalprofile`}
                  className="hover:text-white"
                  aria-current="page"
                >
                  <span className="flex flex-col items-center justify-center">
                    <IoMdNotificationsOutline size={20} />
                  </span>
                  <span className="text-gray-900 hover:text-white">Inbox</span>
                </Link>
              </li>
            </ul>
          )}
        </div>
      )}
      <div className="flex" id="navbar-dropdown">
        {/* <button className="p-2">
          <GrNotification />
          {friendsRequest}
        </button> */}
        <ul className="flex justify-center items-center gap-10 pr-4 text-sm">
          <li className="relative">
            <button
              id="dropdownNavbarLink"
              className="flex items-center justify-between text-base font-bold"
            >
              {loggedin ? (
                <Link to="/personalprofile" className="ml-1">
                  {loggedInUser.username}
                </Link>
              ) : (
                <Link to="/login" className="ml-1">
                  Login
                </Link>
              )}
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
            {/* Dropdown menu */}
            {showDropdown && (
              <div
                id="dropdownNavbar"
                className="absolute right-0 mt-2 bg-[#3bd4ee] -z-50 divide-y divide-gray-100 rounded-b-lg w-32"
              >
                <ul className="py-4 mt-1" aria-labelledby="dropdownLargeButton">
                  {!loggedin ? (
                    <li className="block px-4 py-2 hover:bg-[#f5fefd]">
                      <Link to="/login">Login</Link>
                    </li>
                  ) : (
                    <div>
                      {/* <li className="block px-4 py-2 hover:bg-[#f5fefd]">
                        <Link to="/personalprofile">
                          {loggedInUser.username}
                        </Link>
                      </li> */}
                      <li className="block px-4 py-2 hover:bg-[#f5fefd]">
                        <button onClick={handleSignOut}>Sign Out</button>
                      </li>
                    </div>
                  )}
                  {/* <li className="block px-4 py-2 hover:bg-[#f5fefd]">
                    <Link to="/devs" className="">
                      About Devs
                    </Link>
                  </li> */}
                </ul>
              </div>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
