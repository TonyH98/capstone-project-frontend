import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../Kick.it Logo.png";
import { RiHomeLine } from "react-icons/ri";
import { HiOutlineUsers } from "react-icons/hi";
import { FiMessageCircle } from "react-icons/fi";
import { GrNotification } from "react-icons/gr";
import { BiUser } from "react-icons/bi";
import { useUser } from "../contexts/UserProvider";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "../utils/appUtils";
import axios from "axios";
import app from "../firebase";

const API = process.env.REACT_APP_API_URL;

export default function NavBar({ setUser, setLoggedIn, loggedin }) {
  const navigate = useNavigate();

  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 450px)").matches
  );
  const [active, setActive] = useState(0);
  const [friendsRequest, setFriendsRequest] = useState([]);

  const { user } = useUser();
  const auth = getAuth(app);

  useEffect(() => {
    window
      .matchMedia("(min-width: 450px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);

  useEffect(() => {
    if (user && user.username) {
      console.log(user.username);
    }
  }, [user]);

  let dropdownText;
  if (loggedin) {
    dropdownText = "Sign Out";
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

  useEffect(() => {
    if (user?.id) {
      axios.get(`${API}/friends/${user?.id}/request`).then((res) => {
        setFriendsRequest(res.data.length);
      });
    }
  }, [user?.id]);

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
                    <BiUser size={20} />
                  </span>
                  <span className="text-gray-900 hover:text-white">
                    Profile
                  </span>
                </Link>
              </li>
            </ul>
          )}
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
                    <BiUser size={20} />
                  </span>
                  <span className="text-gray-900 hover:text-white">
                    Profile
                  </span>
                </Link>
              </li>
            </ul>
          )}
        </div>
      )}
      <div className="flex" id="navbar-dropdown">
        <button className="p-2">
          <GrNotification />
          {friendsRequest}
        </button>
        <ul className="flex justify-center items-center gap-10 pr-4 text-sm">
          <li className="">
            <button
              id="dropdownNavbarLink"
              data-dropdown-toggle="dropdownNavbar"
              className="flex items-center justify-between text-base font-bold "
            >
              {dropdownText}
              <svg
                className="w-5 h-5 ml-1"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
            {/* <!-- Dropdown menu --> */}
            <div
              id="dropdownNavbar"
              className="hidden bg-[#3bd4ee] -z-50 divide-y divide-gray-100 rounded-b-lg w-32"
            >
              <ul className="py-4 mt-1" aria-labelledby="dropdownLargeButton">
                {!loggedin ? (
                  <li className="block px-4 py-2 hover:bg-[#f5fefd]">
                    <Link to="/login">Login</Link>
                  </li>
                ) : (
                  <li className="block px-4 py-2 hover:bg-[#f5fefd]">
                    <button onClick={handleSignOut}>Sign Out</button>
                  </li>
                )}
                <li className="block px-4 py-2 hover:bg-[#f5fefd]">Settings</li>
                <li className="block px-4 py-2 hover:bg-[#f5fefd]">
                  <Link to="/devs" className="">
                    About Devs
                  </Link>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
}
