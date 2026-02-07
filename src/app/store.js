import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "../features/projectSlice";
import authReducer from "../features/authSlice";
import userReducer from "../features/userSlice";
import notificationReducer from "../features/notificationSlice";

export const store = configureStore({
  reducer: {
    project: projectReducer,
    auth: authReducer,
    user: userReducer,
    notification: notificationReducer,
  },
});
