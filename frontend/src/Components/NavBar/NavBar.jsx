import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { logOutUser } from "../../redux/apiRequest";
import { createAxios } from './../../createInstance';
import { logOutSuccess } from "../../redux/authSlice";

const NavBar = () => {
  const user = useSelector((state) => state.authReducer.login.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const axiosJWT = createAxios(user, dispatch, logOutSuccess);

  const handleLogOut = (e) => {
    logOutUser(user?.accessToken, user?._id, navigate, dispatch, axiosJWT);
  };

  return (
    <nav className="navbar-container">
      <Link to="/" className="navbar-home">
        Home
      </Link>
      {user ? (
        <>
          <p className="navbar-user">
            Hi, <span> {user.username} </span>
          </p>
          <Link to="/logout" className="navbar-logout" onClick={(e)=>handleLogOut(e)}>
            Log out
          </Link>
        </>
      ) : (
        <>
          <Link to="/login" className="navbar-login">
            Login
          </Link>
          <Link to="/register" className="navbar-register">
            Register
          </Link>
        </>
      )}
    </nav>
  );
};

export default NavBar;
