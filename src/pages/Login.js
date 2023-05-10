// Login page for returning users
// Need to set up open/close modal
import { useState } from 'react';
import { Link } from 'react-router-dom'

function Login() {

    // useState hooks to toggle between show/hide password and store login information
    const [ showPassword, setShowPassword ] = useState(false)
    const [ login, setLogin ] = useState({
        username: '',
        password: ''
    })

    // function to update login info object on change
    const handleTextChange = (e) => {
        setLogin({...login, [e.target.id]: e.target.value})
    }

    return (
        <div>
            <form className="w-96 py-10 bg-indigo-200 m-auto relative">
                <button className="absolute right-3 top-2 text-xl text-red-800">X</button>
                <p className='pb-5 text-md'>
                    Welcome back! Input login info below
                </p>
                <label htmlFor="username">
                    <input 
                        type='text' 
                        id='username'
                        name='usernname' 
                        placeholder="Username" 
                        required 
                        onChange={handleTextChange}
                        className="mb-5 rounded pl-3 block m-auto"
                    />
                </label>

                <label htmlFor="password">
                    <input 
                        type={ showPassword ? 'text' : 'password' } 
                        id='password'
                        name='password' 
                        placeholder="Password"
                        required 
                        onChange={handleTextChange}
                        className="rounded pl-3 m-auto ml-12"
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
                </label>

                <button 
                    type='submit' 
                    className="bg-indigo-500 px-3 text-white mt-5 block m-auto rounded hover:bg-indigo-400"
                >
                    Login
                </button>
                <p className='text-sm mt-5'>
                    Don't have an account yet?
                </p>
                <Link to='/signup' className='block mt-1 underline text-blue-500 hover:text-white'>
                    Sign Up
                </Link>
            </form>
        </div>
    );
}

export default Login;
