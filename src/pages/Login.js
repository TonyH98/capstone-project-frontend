// Login page for returning users
// Need to set up open/close modal
import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserProvider";
import app from "../firebase";

function Login() {
  // useState hooks to toggle between show/hide password and store login information
  const [showPassword, setShowPassword] = useState(false);
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });
  const auth = getAuth(app);
  const navigate = useNavigate();

  // Sets the user in local storage
  const { user, setUser } = useUser();

  // function to send login information to firebase
  const logIn = () => {
    signInWithEmailAndPassword(auth, login.email, login.password)
      .then((userCredential) => {
        const returningUser = userCredential.user;
        if (returningUser) {
          alert("You are now logged in!");
          console.log("logged in");
          setUser(returningUser);
          console.log(user);
          navigate(`/profile/${user.username}`);
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log(errorCode);
      });
  };

  // function to update login info object on change
  const handleTextChange = (e) => {
    setLogin({ ...login, [e.target.id]: e.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    logIn(event);
  };

  return (
    <div className="flex flex-col justify-center items-center p-6">
      <form className="sm:w-96 bg-white shadow-md p-4 rounded-lg flex flex-col items-center justify-center">
        <button className="relative left-[50%] font-bold text-lg">X</button>
        <div>
          <p className="text-lg font-bold py-4">
            Welcome back! Input login info below
          </p>
          <label htmlFor="email">
            <input
              type="text"
              id="email"
              name="email"
              placeholder="email"
              required
              onChange={handleTextChange}
              className="rounded w-[85%] bg-transparent appearance-none focus:outline-none"
            />
          </label>

          <label htmlFor="password">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Password"
              required
              onChange={handleTextChange}
              className="my-3 rounded w-[85%]"
            />
            {showPassword ? (
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="px-1 font-semibold"
              >
                Hide
              </button>
            ) : (
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="px-1 font-semibold"
              >
                Show
              </button>
            )}
          </label>
        </div>
        <button
          type="submit"
          className="bg-cyan-400 border border-cyan-400 text-white hover:text-cyan-400 rounded-md hover:bg-transparent hover:border px-2 py-1 font-bold"
          onClick={handleSubmit}
        >
          Login
        </button>
        <p className="text-sm mt-5">Don't have an account yet?</p>
        <Link
          to="/signup"
          className="block mt-1 underline underline-offset-2 font-semibold text-blue-500 hover:text-cyan-400"
        >
          Sign Up
        </Link>
      </form>
    </div>
  );
}

export default Login;
