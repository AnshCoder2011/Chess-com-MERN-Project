import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [userName, setUserName] = useState("");
  const [joinDate, setJoinDate] = useState("");
  const [friendsCount, setFriendsCount] = useState(0);

  // Fetch user info from localStorage on load
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setUserName(userInfo.username || "");
      setJoinDate(new Date(userInfo.createdAt).toLocaleDateString() || "N/A");
      setFriendsCount(userInfo.friends?.length || 0);
    }
  }, []);

  // Handle updating username
const handleSave = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("userInfo")); // get logged-in user
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`, // pass JWT token
      },
    };

    const { data } = await axios.put(
      `http://localhost:4000/api/auth/update/${user._id}`,
      { username: userName },
      config
    );

    localStorage.setItem("userInfo", JSON.stringify(data)); // update localStorage
    toast.success("Profile updated successfully!");
    setShowProfile(false); // close the dialog
  } catch (error) {
    toast.error(error.response?.data?.message || "Update failed");
  }
};



  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    toast.success("Logged out successfully!");
    navigate("/"); // Redirect to login
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-[#262522] shadow-md">
        <Link to="/home">
          <img src="/icons/logo.png" alt="Logo" className="mb-6 w-32" />
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-gray-200 text-md font-medium">
            Hello, {userName || "Player"}
          </span>

          {/* Profile Button */}
          <button
            onClick={() => setShowProfile(true)}
            className="flex items-center gap-2 bg-[#81B64C] hover:bg-[#6A9636] cursor-pointer text-gray-300 font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow hover:shadow-md"
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
            Profile
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-[#E53E3E] hover:bg-[#C53030] cursor-pointer text-gray-100 font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow hover:shadow-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
              />
            </svg>
            Logout
          </button>

          {/* Profile Modal */}
          {showProfile && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-[#262522] rounded-lg p-6 w-80 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-gray-200 text-xl font-semibold">
                    Profile
                  </h2>
                  <button
                    onClick={() => setShowProfile(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-3 py-2 bg-[#1e1d1b] text-gray-200 rounded border border-gray-600 focus:border-[#81B64C] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-1">
                      Joined
                    </label>
                    <p className="text-gray-400 text-sm">{joinDate}</p>
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-1">
                      Friends
                    </label>
                    <p className="text-gray-400 text-sm">{friendsCount}</p>
                  </div>
                  <button
                    onClick={handleSave} // ✅ attach the function here
                    className="w-full bg-[#81B64C] hover:bg-[#6A9636] text-gray-300 font-semibold py-2 rounded-lg transition-all duration-200"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
