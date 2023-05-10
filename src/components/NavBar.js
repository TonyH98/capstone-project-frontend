import { Link } from "react-router-dom";
import logo from "../Kick.it Logo.png"


export default function NavBar(){
    
    return(
        // <nav className= "inline">
            
        //     <img src={logo} alt="logo" height="100px" >
        //     </img>
            
        //     <h1>
        //         <Link to="/users"> Users</Link>
        //     </h1>
           
        //     <h1>
        //         <Link to="/events"> Events</Link>
        //     </h1>

        //     <h1>
        //         <Link to="/login"> Login/Settings</Link>
        //     </h1>
        // </nav>
        

<nav className="bg-orange-300 border-gray-200 dark:bg-gray-900 dark:border-gray-700 h-20 sticky top-0 mb-10">
  <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
    <Link to='/'><img src={logo} alt="logo" className="h-20 -mt-4" > 
        </img>
        </Link>
    
        {/* <li>

        <Link to="/users" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" > Users</Link>
        </li> */}
       
   
    <div className="hidden w-full md:block md:w-auto" id="navbar-dropdown">
      <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-orange-300 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
        <li>
            <Link to="/users" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 -mt-2 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" aria-current="page">Users</Link>
        </li>
        <li>
            <Link to="/events" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 -mt-2 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" aria-current="page">Events</Link>
        </li>
        <li>
            <button id="dropdownNavbarLink" data-dropdown-toggle="dropdownNavbar" className="flex items-center justify-between -mt-2 w-full py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent">Login/Settings<svg className="w-5 h-5 ml-1" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" ><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg></button>
            {/* <!-- Dropdown menu --> */}
            <div id="dropdownNavbar" className="z-10 hidden font-normal bg-orange-300 divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-400" aria-labelledby="dropdownLargeButton">
                  <li
                     className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"><Link to='/login'>Login/Sign-Up</Link>
                  </li>
                  <li className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings
                  </li>
                  <li className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                  <Link to="/devs" className="mr-4 hover:underline md:mr-6 ">About The Devs</Link>
                  </li>
                </ul>
                <div className="py-1">
                  <Link to="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white">Sign out</Link>
                </div>
            </div>
        </li>
        
      </ul>
    </div>
  </div>
</nav>


    )
}