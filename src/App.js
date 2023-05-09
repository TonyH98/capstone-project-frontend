import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import 'flowbite'
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Devs from "./components/Devs";
import Landing from "./components/Landing";

import './App.css';

function App() {
  return (
    <div className="App">
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
    </div>
  );
}

export default App;
