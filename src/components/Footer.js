import { Link } from "react-router-dom";


export default function Footer(){
    
    return(

        <footer className="w-full bg-purple-200 flex items-center justify-between p-6 text-sm font-medium text-gray-500">
            <p>© 2023 <a href="#" className="hover:underline italic">Kick.it</a>. All Rights Reserved.</p>
            <p>
                <Link to="/devs" className="hover:underline">About The Developers</Link>
            </p>
        </footer>
        
    )
}
