import { Link } from 'react-router-dom'

function Login() {
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
                        name='usernname' 
                        placeholder="Username" 
                        required 
                        className="mb-5 rounded pl-3 block m-auto"
                    />
                </label>

                <label htmlFor="password">
                    <input 
                        type='text' 
                        name='password' 
                        placeholder="Password"
                        required 
                        className="rounded pl-3 block m-auto"
                    />
                </label>

                <button 
                    type='submit' 
                    className="bg-indigo-500 px-3 text-white mt-5 rounded hover:bg-indigo-400"
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