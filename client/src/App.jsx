import React from "react";
import AppRouter from "./routes/AppRouter";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



function App() {
  return (
    <>
      <AppRouter />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}

export default App;
