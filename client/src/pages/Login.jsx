import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  //
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const changeInputHandler = (e) => {
    setUserData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };
  //
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <section className="login">
      <div className="container2">
        <h2>sign in</h2>
        <form className="form  login__form">
          {/* {error && <p className="form__error-message">{error}</p>} */}
          <input
            type="text"
            placeholder="Email"
            name="email"
            value={userData.email}
            onChange={changeInputHandler}
          />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            name="password"
            value={userData.password}
            onChange={changeInputHandler}
          />
          <button
            type="button"
            className="btn secondary"
            onClick={togglePasswordVisibility}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>

          <button type="submit" className="btn primary">
            Login
          </button>
        </form>
        <small>
          Don't have an account ? ....
          <Link to="/Register">Sign up</Link>
        </small>
      </div>
    </section>
  );
};

export default Login;
