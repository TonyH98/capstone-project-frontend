// Sign up page for new users
// NEED TO FIX CANCEL BUTTON, UPDATE PARAMS/NAVIGATES/ROUTES IF NEEDED
// Need to add Validations for age/alert
import axios from "axios";
import { useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";

const API = process.env.REACT_APP_BASE_URL;

function SignUp() {

    // useNavigate and useParams hooks to navigate to user profile page
    const navigate = useNavigate();
    const {id} = useParams();

    // useState hook to toggle between show/hide password
    const [ showPassword, setShowPassword ] = useState(false)

    // useState hook to store user information
    const [ newUser, setNewUser ] = useState({
        firstname : '',
        lastname : '',
        username : '',
        email : '',
        password : '',
        dob : ''
    })

    // function to update newUser object on text change
    const handleTextChange = (e) => {
        setNewUser({...newUser, [e.target.id] : e.target.value})
        console.log(newUser)
    }

    // function to make an axios post request and navigate to user profile page
    // need to update post route
    const handleSubmit = (e) => {
        e.preventDefault();

        axios
          .post(`${API}/user`, newUser)
          .then(() => {
            navigate(`/profile/${id}`);
          })
          .catch((c) => console.warn("catch, c"));
      };

    return (
        <div>
            <form className="w-96 py-10 bg-indigo-200 m-auto relative box-shadow">
                <button className="absolute right-3 top-2 text-xl text-red-800">X</button>
                <label htmlFor="firstname" className="">
                    First Name
                    <input 
                        type='text' 
                        name='firstname'
                        id="firstname" 
                        required 
                        onChange={handleTextChange}
                        className="mb-5 rounded pl-3 block m-auto"
                    />
                </label>

                <label htmlFor="lastname" className="">
                    Last Name
                    </label>
                    <input 
                        type='text' 
                        name='lastname' 
                        id="lastname"
                        required 
                        onChange={handleTextChange}
                        className="mb-5 rounded pl-3 block m-auto"
                    />

                <label htmlFor="username" className="text-left ml-0">
                    Username
                    <input 
                        type='text' 
                        name='username' 
                        id="username"
                        required 
                        onChange={handleTextChange}
                        className="mb-5 rounded pl-3 block m-auto"
                    />
                </label>

                <label htmlFor="firstname" className="text-left ml-0">
                    Email
                    <input 
                        type='text' 
                        name='firstname' 
                        id="email"
                        required 
                        onChange={handleTextChange}
                        className="mb-5 rounded pl-3 block m-auto"
                    />
                </label>

                <label htmlFor="password" className="block">
                Password
                </label>
                    <input 
                        type={showPassword ? 'text' : 'password' }
                        name='password' 
                        id="password"
                        required 
                        onChange={handleTextChange}
                        className="rounded pl-3 ml-5 mb-5"
                    />
                { 
                    showPassword ? 
                        <p 
                            onClick={() => setShowPassword(!showPassword)}    
                            className="text-sm underline hover:text-blue-400 inline pl-3"
                        >
                            Hide
                        </p> : 
                            <p 
                                onClick={() => setShowPassword(!showPassword)} 
                                className="text-sm underline hover:text-blue-400 inline pl-3"
                            >
                                Show
                            </p> 
                }

                <label htmlFor="dob" className=" block">
                    Date of Birth
                    <input 
                        type='date' 
                        name='dob' 
                        id="dob"
                        required 
                        onChange={handleTextChange}
                        className="mb-5 rounded pl-3 block m-auto"
                        />
                </label>

                <button 
                    type='submit' 
                    onClick={handleSubmit}
                    className="bg-indigo-500 px-3 text-white mt-5 rounded hover:bg-indigo-400"
                >
                    Submit
                </button>
                <button 
                    onClick={() => navigate('/')}
                    className="bg-red-400 px-3 text-white mt-5 rounded hover:bg-red-300"
                >
                    Cancel
                </button>
            </form>
        </div>
    );
}

export default SignUp;
