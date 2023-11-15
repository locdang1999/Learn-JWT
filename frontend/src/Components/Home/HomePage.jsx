import { useEffect } from "react";
import "./home.css";
import { deleteUsers, getAllUsers } from "../../redux/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import { createAxios } from "../../createInstance";
import { loginSuccess } from "../../redux/authSlice";

const HomePage = () => {
  const user = useSelector((state) => state.authReducer.login?.currentUser);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userReducer.users?.allUsers);
  const msg = useSelector((state) => state.userReducer.msg);
  const axiosJWT = createAxios(user, dispatch, loginSuccess);

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
        !user ? "" : user?.admin ? "Admin" : "User"
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
