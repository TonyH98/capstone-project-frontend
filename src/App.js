import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import './App.css';

const API = process.env.REACT_APP_BASE_URL;

function App() {
  const [ message, setMessage ] = useState()

  useEffect(() => {
    axios
      .get(`${API}`)
      .then((res) => {
        setMessage(res.data.message)
        console.log(message)
      })
      .catch((c) => console.warn("catch, c"));
  }, []);

  return (
    
    <div className="App">
      <Router>
        <Routes>
          {/* <Route path='/' element={} /> */}
          <Route path='/login' element={<Login />}/>
          <Route path='/signup' element={<SignUp />}/>

        </Routes>
      </Router>
    </div>
  );
}

export default App;
