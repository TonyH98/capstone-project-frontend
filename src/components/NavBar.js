import { Link } from "react-router-dom";
import logo from "../Kick.it Logo.png"


export default function NavBar(){
    
    return(
        <nav>
            
            <img src={logo} alt="logo" height="100px" >
            </img>
            
            <h1>
                <Link to="/users"> Users</Link>
            </h1>
           
            <h1>
                <Link to="/events"> Events</Link>
            </h1>

            <h1>
                <Link to="/login"> Login/Settings</Link>
            </h1>
        </nav>
    )
}