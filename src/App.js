import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import app from "./firebase";
import axios from "axios";

import "flowbite";
import "./App.css";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Devs from "./components/Devs";
import Landing from "./pages/LandingPage";
import UserProfile from "./pages/UserProfile";
import ShowUsers from "./pages/ShowUsers";
import ShowEvents from "./pages/ShowEvents";
import EventDetails from "./pages/EventDetails";
import NewEvent from "./pages/NewEvent";
import Map from "./components/Map";
import useLocalStorage from "./hooks/useLocalStorage";
import { UserProvider } from "./contexts/UserProvider";
import Messages from "./pages/Messages";
import ShowRoom from "./pages/ShowRoom";
const API = process.env.REACT_APP_API_URL;

function App() {
  // This state is set to false by default and is set to true by the function on line 31
  const [loggedin, setLoggedin] = useLocalStorage("loggedin", false);
<<<<<<<<< Temporary merge branch 1
  // store current user
  const [user, setUser] = useLocalStorage("user", {});
  // store all other users
  const [users, setUsers] = useState([]);
=========
  const [loggedInUser, setLoggedInUser] = useLocalStorage("loggedInUser", {});
>>>>>>>>> Temporary merge branch 2
  // const { user, setUser } = useUser();
  const [firebaseId, setFirebaseId] = useState("");
  const auth = getAuth(app);

  // Once the user is authenticated by firebase it sets logged in to true and sets the firebaseid
  // This also will set loggedin to false once a user has signed out
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setLoggedin(true);
      setFirebaseId(user.uid);
    } else {
      setLoggedin(false);
    }
  });

  // This useEffect uses the firebaseId to retrieve the users data from the backend
  useEffect(() => {
    console.log(firebaseId);

    console.log("call here for first login", loggedin, firebaseId);

    if (loggedin && firebaseId) {
      console.log("call here for first login");
      // Add a condition to check if firebaseId is truthy
      axios
        .get(`${API}/users/firebase/${firebaseId}`)
        .then((response) => {
<<<<<<<<< Temporary merge branch 1
          setUser(response.data);
          console.log(response.data);
=========
          setLoggedInUser(response.data);
          console.log("RESPONSE SERVER", response.data);
>>>>>>>>> Temporary merge branch 2
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setLoggedInUser({});
    }
  }, [loggedin, firebaseId]);

<<<<<<<<< Temporary merge branch 1
  // useEffect makes get request for all Users
  useEffect(() => {
    axios
      .get(`${API}/users`)
      .then((res) => {
        setUsers(res.data);
        console.log(res.data)
    })
    .catch((c) => console.warn("catch, c"));
}, []);

=========
  console.log("USER", loggedInUser);
>>>>>>>>> Temporary merge branch 2
  return (
    <div className="App bg-[#f5fefd] min-h-[100%]">
      {/* useContext files can be pass here to allow all components to have access to global data */}
      {/* let's say we have a FriendsProvider file in our contexts folder, we can pass it here and the MESSAGES, USER_PROFILE, and EVENTS components will all have access to it from here, no need to pass props or creating multiple state. */}
      {/* <FriendsProvider> */}
      <UserProvider>
        <Router>
          <NavBar
            loggedin={loggedin}
            setLoggedIn={setLoggedin}
            setUser={setLoggedInUser}
            setFirebaseId={setFirebaseId}
          />
          <main className="h-[100%]">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              {/* 
              Comment in when useParams is set up and remove UserProfile below
              <Route path='/profile/:id' element={<UserProfile />} /> 
              */}
              <Route path="/profile/:profileName" element={<UserProfile />} />
              <Route path="/devs" element={<Devs />} />
              <Route path="/events" element={<ShowEvents />} />
              <Route path="/events/new" element={<NewEvent />} />
              <Route path="/users" element={<ShowUsers />} />
<<<<<<<<< Temporary merge branch 1
              <Route path="/rooms" element={<Messages user={user} setUser={setUser} users={users} setUsers={setUsers} loggedin={loggedin} setLoggedin={setLoggedin} firebaseId={firebaseId} />} />
              <Route path="/rooms/:user1_id/:user2_id" element={<ShowRoom user={user} setUser={setUser} users={users} setUsers={setUsers} loggedin={loggedin} setLoggedin={setLoggedin} firebaseId={firebaseId} />} />
              {/* <Route path="/chat/:conversationId" element={<ConversationsPage user={user} setUser={setUser} loggedin={loggedin} setLoggedin={setLoggedin} firebaseId={firebaseId} />} /> */}
=========
              <Route
                path="/chats"
                element={
                  <Messages
                    user={loggedInUser}
                    setUser={setLoggedInUser}
                    loggedin={loggedin}
                    setLoggedin={setLoggedin}
                    firebaseId={firebaseId}
                  />
                }
              />
>>>>>>>>> Temporary merge branch 2
              {/* 
              Comment in when useParams is set up and remove EventDetails below
              <Route path='/events/:id' element={<EventDetails />} /> 
              */}
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/map" element={<Map />} />
            </Routes>
          </main>
          {/* <Footer/> */}
        </Router>

        {/* </FriendsProvider> */}
      </UserProvider>
    </div>
  );
}

export default App;
