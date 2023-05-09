import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import 'flowbite'
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Devs from "./components/Devs";
import Landing from "./components/Landing";
import './App.css';

function App() {
  return (
    <div className="App">
      {/* useContext files can be pass here to allow all components to have access to global data */}
      {/* let's say we have a FriendsProvider file in our contexts folder, we can pass it here and the MESSAGES, USER_PROFILE, and EVENTS components will all have access to it from here, no need to pass props or creating multiple state. */}
      {/* <FriendsProvider> */}
      <Router>
         <NavBar/>
         <main>
            <Routes>
              <Route path='/' element={<Landing/>} />
              <Route path='/login' element={<Login />}/>
              <Route path='/signup' element={<SignUp />}/>
              <Route path='/devs' element={<Devs/>} />
            </Routes>
          </main>
        <Footer/>
      </Router>

      {/* </FriendsProvider> */}
    </div>
  );
}

export default App;
