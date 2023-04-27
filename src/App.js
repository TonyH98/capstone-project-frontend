import { useEffect, useState } from "react";
import axios from "axios";
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
      <header className="App-header">
        <h1>{message}</h1>
      </header>
    </div>
  );
}

export default App;
