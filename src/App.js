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
import Landing from "./components/Landing";
import UserProfile from "./pages/UserProfile";
import ShowEvents from "./pages/ShowEvents";
import EventDetails from "./pages/EventDetails";
import NewEvent from "./pages/NewEvent";
import Map from "./components/Map";
const API = process.env.REACT_APP_API_URL;

function App() {
  const [loggedin, setLoggedin] = useState(false);
  const [user, setUser] = useState({});
  const [firebaseId, setFirebaseId] = useState("");
  const auth = getAuth(app);


  // Can Comment back in 28-50 once login page has firebase working
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setLoggedin(true);
      setFirebaseId(user.uid);
    } else {
      setLoggedin(false);
    }
  });

  useEffect(() => {
    if (loggedin) {
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
    </div>
  );
}

export default App;
