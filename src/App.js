import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import app from "./firebase";

import "flowbite";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Devs from "./components/Devs";
import Landing from "./components/Landing";
import ShowEvents from "./pages/ShowEvents";
import EventDetails from "./pages/EventDetails";
import NewEvent from "./pages/NewEvent";
import EditEvent from "./pages/EditEvent";

import "./App.css";

function App() {
  const [loggedin, setLoggedin] = useState(false);
  const [user, setUser] = useState({});
  const [firebaseId, setFirebaseId] = useState("");
  const auth = getAuth(app);

  // onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     setLoggedin(true);
  //     setFirebaseId(user.uid);
  //   } else {
  //     setLoggedin(false);
  //   }
  // });

  // useEffect(() => {
  //   if (loggedin) {
  //     axios
  //       .get(`${API}/users/firebase/${firebaseId}`)
  //       .then((response) => {
  //         setUser(response.data);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   } else {
  //     setUser({});
  //   }
  // }, [loggedin, firebaseId]);

  return (
    <div className="App">
      <Router>
        <NavBar />
        <main>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/devs" element={<Devs />} />
            <Route path="/events" element={<ShowEvents />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/events/:id/edit" element={<EditEvent />} />
            <Route path="/events/new" element={<NewEvent />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
