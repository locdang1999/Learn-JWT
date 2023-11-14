import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import "./home.css";
import { deleteUsers, getAllUsers, refreshToken } from "../../redux/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { loginSuccess } from "../../redux/authSlice";

const HomePage = () => {
  const user = useSelector((state) => state.authReducer.login?.currentUser);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userReducer.users?.allUsers);
  const msg = useSelector((state) => state.userReducer.msg);

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async (config) => {
      let date = new Date();
      const decodeToken = jwtDecode(user?.accessToken);
      console.log(decodeToken);
      if (decodeToken.exp < date.getTime() / 1000) {
        const data = await refreshToken();
        const refreshUser = {
          ...user,
          accessToken: data.accessToken,
        };

        dispatch(loginSuccess(refreshUser));
        config.headers["token"] = "Bearer " + data.accessToken;
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  useEffect(() => {
    getAllUsers(user?.accessToken, dispatch, axiosJWT);
  }, []);

  const hanldeDelete = (id) => {
    deleteUsers(user?.accessToken, dispatch, id);
  };

  return (
    <main className="home-container">
      <div className="home-title">User List</div>
      <div className="home-role">{`Your role: ${
        user?.admin ? "Admin" : "User"
      }`}</div>
      <div className="home-userlist">
        {userData?.map((user, idx) => {
          return (
            <div className="user-container" key={idx}>
              <div className="home-user">{user.username}</div>
              <div
                className="delete-user"
                onClick={() => hanldeDelete(user.id)}
              >
                Delete
              </div>
            </div>
          );
        })}
      </div>
      {msg}
    </main>
  );
};

export default HomePage;
