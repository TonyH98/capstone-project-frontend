import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import './App.css';
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";



  return (
    
    <div className="App">
      <Router>
         <NavBar/>
         <main>
            <Routes>
              {/* <Route path='/' element={} /> */}
              <Route path='/login' element={<Login />}/>
              <Route path='/signup' element={<SignUp />}/>

            </Routes>
          </main>
        <Footer/>
      </Router>
    </div>
  )
}

export default App;
