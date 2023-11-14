import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: {
      allUsers: null,
      isFetching: false,
      error: false,
    },
    msg: "",
  },
  reducers: {
    getUsersStart: (state) => {
      state.users.isFetching = true;
    },
    getUsersSussecc: (state, action) => {
      state.users.isFetching = true;
      state.users.allUsers = action.payload;
    },
    getUsersFailed: (state) => {
      state.users.isFetching = false;
      state.users.error = true;
    },

    deleteUsersStart: (state) => {
      state.users.isFetching = true;
    },
    deleteUsersSussecc: (state, action) => {
      state.users.isFetching = true;
      state.msg = action.payload;
    },
    deleteUsersFailed: (state, action) => {
      state.users.isFetching = false;
      state.users.error = true;
      state.msg = action.payload;
    },
  },
});

export const {
  getUsersStart,
  getUsersSussecc,
  getUsersFailed,
  deleteUsersStart,
  deleteUsersSussecc,
  deleteUsersFailed,
} = userSlice.actions;

export default userSlice.reducer;
