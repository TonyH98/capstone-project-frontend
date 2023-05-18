// Sign up page for new users
// NEED TO FIX CANCEL BUTTON, UPDATE PARAMS/NAVIGATES/ROUTES IF NEEDED
// Need to add Validations for age/alert
import axios from "axios";
import { useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import app from "../firebase";

const API = process.env.REACT_APP_BASE_URL;

function SignUp() {
  // useNavigate and useParams hooks to navigate to user profile page
  const navigate = useNavigate();
  const { id } = useParams();

  // useState hook to toggle between show/hide password
  const [showPassword, setShowPassword] = useState(false);

  const auth = getAuth(app);

  // useState hook to store user information
  const [newUser, setNewUser] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    dob: "",
    firebaseId: "",
  });

  // function to update newUser object on text change
  const handleTextChange = (e) => {
    setNewUser({ ...newUser, [e.target.id]: e.target.value });
    console.log(newUser);
  };

  // function to create a new account with firebase
  const signUp = async () => {
    createUserWithEmailAndPassword(auth, newUser.email, newUser.password)
      .then(async (userCredential) => {
        const newUser = userCredential.user;
        if (newUser) {
          navigate("/profile");
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log(errorCode);
      });
  };

  // function to make an axios post request and navigate to user profile page
  // need to update post route
  const handleSubmit = (e) => {
    e.preventDefault();
    signUp();

    axios
      .post(`${API}/user`, newUser)
      .then(() => {
        navigate(`/profile/${id}`);
      })
      .catch((c) => console.warn("catch, c"));
  };

  return (
    <div className="sm:w-full md:w-3/5 lg:w-2/5 md:m-auto mx-3 my-6 p-1">
        <form className="bg-white text-slate-800 dark:text-slate-100 dark:bg-slate-900 shadow-md rounded px-10 pt-6 pb-8 mb-4">
            <div className="mb-4">
                <label htmlFor="firstname" className="block text-gray-700 text-sm font-bold mb-2">
                First Name
                </label>
                <input 
                    type='text' 
                    name='firstname'
                    id="firstname" 
                    required 
                    onChange={handleTextChange}
                    className="mb-5 pl-3 block m-auto shadow bg-transparent appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="lastname" className="block text-gray-700 text-sm font-bold mb-2">
                Last Name
                </label>
                <input 
                    id="lastname"
                    required 
                    onChange={handleTextChange}
                    className="mb-5 pl-3 block m-auto shadow bg-transparent appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                Username
                </label>
                <input 
                    type='text' 
                    name='username' 
                    id="username"
                    required 
                    onChange={handleTextChange}
                    className="mb-5 pl-3 block m-auto shadow bg-transparent appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="firstname" className="block text-gray-700 text-sm font-bold mb-2">
                Email
                </label>
                <input 
                    type='text' 
                    name='firstname' 
                    id="email"
                    required 
                    onChange={handleTextChange}
                    className="mb-5 pl-3 block m-auto shadow bg-transparent appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                Password
                </label>
                <input 
                    type={showPassword ? 'text' : 'password' }
                    name='password' 
                    id="password"
                    required 
                    onChange={handleTextChange}
                    className="shadow bg-transparent appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                { 
                showPassword ? 
                    <button 
                        type='button'
                        onClick={() => setShowPassword(!showPassword)}    
                        className="text-sm underline hover:text-blue-400 inline pt-2"
                    >
                        Hide password
                    </button> : 
                    <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)} 
                        className="text-sm underline hover:text-blue-400 inline pt-2"
                    >
                        Show password
                    </button> 
            }
            </div>
            <div className="mb-4">
            <label htmlFor="dob" className="block text-gray-700 text-sm font-bold mb-2">
                Date of Birth
                <input 
                    type='date' 
                    name='dob' 
                    id="dob"
                    required 
                    onChange={handleTextChange}
                    className="rounded block my-2"
                    />
            </label>
            </div>
            <div className="flex justify-evenly">
            <button 
                type='submit' 
                onClick={handleSubmit}
                className="btn-1"
            >
                Submit
            </button>
            <button 
                onClick={() => navigate('/')}
                className="btn-2"
            >
                Cancel
            </button>
            </div>
        </form>
    </div>
);
}

export default SignUp;
