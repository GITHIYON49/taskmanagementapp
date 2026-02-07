import { createSlice } from "@reduxjs/toolkit";
import { dummyUsers } from "../assets/assets";

const initialState = {
  users: dummyUsers || [],
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    addUser: (state, action) => {
      state.users.push(action.payload);
    },
    updateUserData: (state, action) => {
      state.users = state.users.map((user) =>
        user.id === action.payload.id ? { ...user, ...action.payload } : user,
      );
    },
    removeUser: (state, action) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
  },
});

export const { setUsers, addUser, updateUserData, removeUser } =
  userSlice.actions;

export default userSlice.reducer;
