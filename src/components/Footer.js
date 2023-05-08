import { Link } from "react-router-dom";


export default function Footer(){
    
    return(
        <footer>
            
            <h4>
               Kick.it 2023
            </h4>
           
            <h4>
                <Link to="/devs"> About the Creaters</Link>
            </h4>

        </footer>
    )
}