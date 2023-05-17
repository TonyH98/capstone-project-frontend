// Login page for returning users
// Need to set up open/close modal
import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom";
import app from "../firebase";

function Login() {
  // useState hooks to toggle between show/hide password and store login information
  const [showPassword, setShowPassword] = useState(false);
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });
  const auth = getAuth(app);

  // function to send login information to firebase
  const logIn = () => {
    signInWithEmailAndPassword(auth, login.email, login.password)
      .then((userCredential) => {
        const returningUser = userCredential.user;
        if (returningUser) {
          alert("You are now logged in!");
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
    <div>
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
  );
}

export default Login;
