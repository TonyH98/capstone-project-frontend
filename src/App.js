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
import ShowUsers from "./pages/ShowUsers"
import ShowEvents from "./pages/ShowEvents";
import EventDetails from "./pages/EventDetails";
import NewEvent from "./pages/NewEvent";
import Map from "./components/Map";
import useLocalStorage from "./hooks/useLocalStorage";
import { UserProvider, useUser } from "./contexts/UserProvider";
import Messages from "./pages/Messages";
const API = process.env.REACT_APP_API_URL;

function App() {
  // This state is set to false by default and is set to true by the function on line 31
  const [loggedin, setLoggedin] = useLocalStorage("loggedin", false);
  const [user, setUser] = useLocalStorage("user", {});
  // const { user, setUser } = useState({});
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

    console.log('call here for first login', loggedin, firebaseId);

    if (loggedin && firebaseId) {

      console.log('call here for first login')
      // Add a condition to check if firebaseId is truthy
      axios
        .get(`${API}/users/firebase/${firebaseId}`)
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setUser({});
    }
  }, [loggedin, firebaseId]);

  return (
    <div className="App bg-[#f5fefd] min-h-[100%]">
      {/* useContext files can be pass here to allow all components to have access to global data */}
      {/* let's say we have a FriendsProvider file in our contexts folder, we can pass it here and the MESSAGES, USER_PROFILE, and EVENTS components will all have access to it from here, no need to pass props or creating multiple state. */}
      {/* <FriendsProvider> */}
      <UserProvider>
        <Router>
          <NavBar />
          <main className="h-[100%]">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              {/* 
              Comment in when useParams is set up and remove UserProfile below
              <Route path='/profile/:id' element={<UserProfile />} /> 
              */}
              <Route path="/profile/:username" element={<UserProfile />} />
              <Route path="/devs" element={<Devs />} />
              <Route path="/events" element={<ShowEvents />} />
              <Route path="/events/new" element={<NewEvent />} />
              <Route path="/users" element={<ShowUsers />} />
              <Route path="/chats" element={<Messages user={user} setUser={setUser} loggedin={loggedin} setLoggedin={setLoggedin} firebaseId={firebaseId} />} />
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
