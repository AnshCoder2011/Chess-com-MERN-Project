import { Routes, Route } from "react-router-dom";
import Login from "../pages/Auth/Login.jsx";
import Register from "../pages/Auth/Register.jsx";
import Home from "../pages/Home.jsx"; // placeholder for homepage
import GameRoom from "../pages/GameRoom.jsx";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/game/:roomCode" element={<GameRoom />} />
    </Routes>
  );
};

export default AppRouter;
