import {
  loginFailed,
  loginStart,
  loginSuccess,
  registerFailed,
  registerStart,
  registerSuccess,
} from "./authSlice";
import axios from "axios";
import {
  deleteUsersFailed,
  deleteUsersStart,
  deleteUsersSussecc,
  getUsersFailed,
  getUsersStart,
  getUsersSussecc,
} from "./userSlice";

export const loginUser = async (user, dispatch, navigate) => {
  dispatch(loginStart());
  try {
    const res = await axios.post("http://localhost:8000/v1/auth/login", user, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    dispatch(loginSuccess(res.data));
    navigate("/");
  } catch (error) {
    dispatch(loginFailed());
  }
};

export const registerUser = async (user, dispatch, navigate) => {
  dispatch(registerStart());
  try {
    const res = await axios.post(
      "http://localhost:8000/v1/auth/register",
      user,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    dispatch(registerSuccess(res.data));
    navigate("/login");
  } catch (error) {
    dispatch(registerFailed());
  }
};

export const getAllUsers = async (accessToken, dispatch, axiosJWT) => {
  dispatch(getUsersStart());
  try {
    const res = await axiosJWT.get("http://localhost:8000/v1/user", {
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${accessToken}`,
      },
    });

    dispatch(getUsersSussecc(res.data));
  } catch (error) {
    dispatch(getUsersFailed());
  }
};

export const deleteUsers = async (accessToken, dispatch, id) => {
  dispatch(deleteUsersStart());
  try {
    const res = await axios.delete(`http://localhost:8000/v1/user/${id}`, {
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${accessToken}`,
      },
    });

    dispatch(deleteUsersSussecc(res.data));
  } catch (error) {
    dispatch(deleteUsersFailed(error.response.data));
  }
};

export const refreshToken = async () => {
  try {
    const res = await axios.post("http://localhost:8000/v1/auth/refresh", {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true
    });
    console.log(res);
    return res.data
  } catch (error) {
    console.log(error);
  }
};
