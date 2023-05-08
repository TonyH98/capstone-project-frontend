import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";



function App(){
  return(
    <div className="App">
      <Router>
        <NavBar/>
        <main>
          <Routes>
          
          </Routes>
        </main>
        <Footer/>
      </Router>
    </div>
  )
}

export default App;
