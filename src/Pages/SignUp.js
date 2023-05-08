function SignUp() {
    return (
        <div>
            <form className="w-96 py-10 bg-indigo-200 m-auto relative box-shadow">
                <button className="absolute right-3 top-2 text-xl text-red-800">X</button>
                <label htmlFor="firstname" className="">
                    First Name
                    <input 
                        type='text' 
                        name='firstname' 
                        required 
                        className="mb-5 rounded pl-3 block m-auto"
                    />
                </label>

                <label htmlFor="lastname" className="">
                    Last Name
                    </label>
                    <input 
                        type='text' 
                        name='lastname' 
                        required 
                        className="mb-5 rounded pl-3 block m-auto"
                    />

                <label htmlFor="username" className="text-left ml-0">
                    Username
                    <input 
                        type='text' 
                        name='username' 
                        required 
                        className="mb-5 rounded pl-3 block m-auto"
                    />
                </label>

                <label htmlFor="firstname" className="text-left ml-0">
                    Email
                    <input 
                        type='text' 
                        name='firstname' 
                        required 
                        className="mb-5 rounded pl-3 block m-auto"
                    />
                </label>

                <label htmlFor="password">
                Password
                    <input 
                        type='text' 
                        name='password' 
                        required 
                        className="rounded pl-3 block m-auto"
                    />
                </label>

                <label htmlFor="dob" className="text-left ml-0">
                    Date of Birth
                    <input 
                        type='text' 
                        name='dob' 
                        required 
                        className="mb-5 rounded pl-3 block m-auto"
                        />
                </label>

                <button 
                    type='submit' 
                    className="bg-indigo-500 px-3 text-white mt-5 rounded hover:bg-indigo-400"
                >
                    Submit
                </button>
                <button 
                    className="bg-red-400 px-3 text-white mt-5 rounded hover:bg-red-300"
                >
                    Cancel
                </button>
            </form>
        </div>
    );
}

export default SignUp;