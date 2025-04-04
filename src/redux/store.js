import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/user";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
