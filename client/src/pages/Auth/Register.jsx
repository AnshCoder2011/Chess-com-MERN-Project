import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/auth/register",
        formData
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("Registration successful!");
      navigate("/home");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#302E2B] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[#262522] text-white p-10 rounded-2xl shadow-2xl w-full max-w-md"
      >
        {/* Logo */}
        <img
          src="/icons/logo.png"
          alt="Logo"
          className="mx-auto mb-6 w-48"
        />

        {/* Title */}
        <h2 className="text-3xl font-bold mb-8 text-center text-white mt-8">
          Create Account
        </h2>

        {/* Username Input */}
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-3 mb-3 bg-[#403E3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81B64C] placeholder-gray-400"
          required
        />

        {/* Email Input */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 mb-3 bg-[#403E3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81B64C] placeholder-gray-400"
          required
        />

        {/* Password Input */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 mb-3 bg-[#403E3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81B64C] placeholder-gray-400"
          required
        />

        {/* Confirm Password Input */}
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full p-3 mb-3 bg-[#403E3C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81B64C] placeholder-gray-400"
          required
        />

        {/* Register Button */}
        <button
          type="submit"
          className="w-full bg-[#81B64C] mt-2 cursor-pointer hover:bg-[#6A9636] text-white font-bold p-3 rounded-lg transition-all duration-200"
        >
          Sign Up
        </button>

        {/* Login Link */}
        <p className="mt-6 text-center text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#81B64C] hover:underline font-semibold"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
