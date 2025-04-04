"use client";
import { store } from "@/redux/store";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";

export default function ReduxProvider({ children }) {
  return (
    <>
      <Toaster />
      <Provider store={store}>{children}</Provider>
    </>
  );
}
