import { useNavigate } from "react-router-dom";
import emailIcon from "./email.png";
import React, { useState, useEffect } from "react";
import "./Login.css";

import book1 from "../assets/harry.webp";
import book2 from "../assets/harry1.webp";
import book3 from "../assets/123.webp";
import book4 from "../assets/rectangle-3.webp";
import book5 from "../assets/rectangle-4.webp";
import book6 from "../assets/spi.webp";
import book7 from "../assets/s.webp";
import book8 from "../assets/war.webp";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Signup | SmartReadsML";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://smartreadsml-backend.onrender.com/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Account created! Please login.");
        navigate("/login");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Server error");
    }
  };

  return (
    <div className="signup-bg">
      {/* Floating Books */}
      {/* <img src={book1} alt="" className="floating-book fb-1" />
      <img src={book2} alt="" className="floating-book fb-2" />
      <img src={book3} alt="" className="floating-book fb-3" />
      <img src={book4} alt="" className="floating-book fb-4" />
      <img src={book5} alt="" className="floating-book fb-5" />
      <img src={book6} alt="" className="floating-book fb-6" />
      <img src={book7} alt="" className="floating-book fb-7" />
      <img src={book8} alt="" className="floating-book fb-8" /> */}

      <div className="login-card">
        <div className="brand-header">
          <span className="brand-dot" />
          <span className="brand-name">SmartReadsML</span>
        </div>

        <div className="icon-box">
          <img src={emailIcon} alt="email icon" className="logo-img" />
        </div>

        <h2 className="login-title">Create Account</h2>
        <p className="subtitle">
          Join SmartReadsML and start your reading journey
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Sign Up →
          </button>

          <div className="signup-text">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Login</span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
