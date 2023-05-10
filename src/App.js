import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import 'flowbite'
import './App.css';
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Devs from "./components/Devs";
import Landing from "./components/Landing";
import UserProfile from "./pages/ UserProfile";
import ShowEvents from "./pages/ShowEvents";
import EventDetails from "./pages/EventDetails";
import NewEvent from "./pages/NewEvent";
import Map from "./components/Map";

function App() {
  return (
    <div className="App">
      <Router>

         <NavBar/>
         <main>
            <Routes>
              <Route path='/' element={<Landing/>} />
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<SignUp />} />
              {/* 
              Comment in when useParams is set up and remove UserProfile below
              <Route path='/profile/:id' element={<UserProfile />} /> 
              */}
              <Route path='/profile' element={<UserProfile />} />
              <Route path='/devs' element={<Devs/>} />
              <Route path='/events' element={<ShowEvents />} />
              <Route path='/events/new' element={<NewEvent />} />
              {/* 
              Comment in when useParams is set up and remove EventDetails below
              <Route path='/events/:id' element={<EventDetails />} /> 
              */}
              <Route path='/map' element={<Map />} />
            </Routes>
          </main>
        <Footer/>

      </Router>
    </div>
  );
}

export default App;
