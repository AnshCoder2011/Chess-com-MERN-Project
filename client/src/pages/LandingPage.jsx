import React from "react";
import {
  FaChessPawn,
  FaChessKnight,
  FaChessKing,
  FaPlay,
  FaPuzzlePiece,
  FaBook,
  FaEye,
  FaNewspaper,
  FaUserFriends,
  FaEllipsisH,
  FaSearch,
} from "react-icons/fa";
import { Navigate } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="flex bg-[#302E2B] min-h-screen text-white font-sans">
      {/* Sidebar */}
      <aside className="w-52 bg-[#262522] flex flex-col justify-between py-6">
        <div>
          <img className="mx-auto mb-6 w-36" src="/icons/logo.png" alt="Logo" />

          <nav className="flex flex-col ml-4 mt-10 gap-4 px-6">
            {[
              {
                icon: <FaPuzzlePiece />,
                label: "Puzzles",
                link: "https://www.chess.com/puzzles",
              },
              {
                icon: <FaBook />,
                label: "Learn",
                link: "https://www.chess.com/learn",
              },
              {
                icon: <FaEye />,
                label: "Watch",
                link: "https://www.chess.com/watch",
              },
              {
                icon: <FaNewspaper />,
                label: "News",
                link: "https://www.chess.com/news",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer"
              >
                <span className="text-xl cursor-pointer" onClick={() => (window.location.href = item.link)}>{item.icon}</span>
                <span className="text-lg cursor-pointer" onClick={() => (window.location.href = item.link)}>{item.label}</span>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3 px-6">
          <div className="relative">
            <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-[#1f1f1f] text-sm py-2 pl-9 rounded focus:outline-none placeholder-gray-400"
            />
          </div>
          <button
            onClick={() => (window.location.href = "/register")}
            className="bg-green-600 cursor-pointer hover:bg-green-500 text-white py-2 rounded font-semibold"
          >
            Sign Up
          </button>
          <button
            onClick={() => (window.location.href = "/login")}
            className="bg-[#2b2b2b] cursor-pointer hover:bg-[#3a3a3a] text-white py-2 rounded font-semibold"
          >
            Log In
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="flex items-center text-center">
          {/* Chess Illustration */}
          <div className="flex items-end justify-center gap-8 mb-10">
            <img className="w-[70%]" src="/icons/image.png" alt="" />
          </div>

          {/* Text */}
          <div className="flex flex-col mr-[25%]">
            <h1 className="text-4xl font-extrabold mb-2 leading-snug">
              Play chess. <br /> Improve your game. <br /> Have fun!
            </h1>

            {/* Button */}
            <button
              onClick={() => (window.location.href = "/register")}
              className="mt-6 bg-[#81B64C] cursor-pointer hover:bg-[#6A9636] px-10 py-4 rounded-lg text-xl font-semibold shadow-md"
            >
              Get Started
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
