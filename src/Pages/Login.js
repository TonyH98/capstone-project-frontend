function Login() {
    return (
        <div>
            <form className="w-96 py-20 bg-indigo-200 m-auto">
                <button>X</button>
                <label htmlFor="username">
                    <input 
                        type='text' 
                        name='usernname' 
                        placeholder="Username" 
                        required 
                        className="mb-5 rounded pl-3"
                    />
                </label>
                <br/>
                <label htmlFor="password">
                    <input 
                        type='text' 
                        name='password' 
                        placeholder="Password" 
                        required 
                        className="rounded pl-3"
                    />
                </label>
                <br/>
                <button type='submit' className="bg-indigo-500 px-3 text-white mt-5 rounded">Login</button>
            </form>
        </div>
    );
}

export default Login;