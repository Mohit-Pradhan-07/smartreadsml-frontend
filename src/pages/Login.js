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

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login | SmartReadsML";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://smartreadsml-backend.onrender.com/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("user", email);
        navigate("/");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Server error");
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      setForgotMsg("⚠️ Please enter your email.");
      return;
    }
    try {
      const response = await fetch(
        "https://smartreadsml-backend.onrender.com/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotEmail }),
        },
      );
      const data = await response.json();
      if (response.ok) {
        setForgotMsg("✅ Reset email sent! Check your inbox.");
      } else {
        setForgotMsg("❌ " + (data.message || "Email not found."));
      }
    } catch (error) {
      setForgotMsg("⚠️ Reset feature coming soon!");
    }
  };

  return (
    <div className="login-bg">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <img src={book1} alt="" className="floating-book fb-1" />
      <img src={book2} alt="" className="floating-book fb-2" />
      <img src={book3} alt="" className="floating-book fb-3" />
      <img src={book4} alt="" className="floating-book fb-4" />
      <img src={book5} alt="" className="floating-book fb-5" />
      <img src={book6} alt="" className="floating-book fb-6" />
      <img src={book7} alt="" className="floating-book fb-7" />
      <img src={book8} alt="" className="floating-book fb-8" />

      <div className="login-card">
        <div className="brand-header">
          <span className="brand-dot" />
          <span className="brand-name">SmartReadsML</span>
        </div>

        <div className="icon-box">
          <img src={emailIcon} alt="email icon" className="logo-img" />
        </div>

        <h2 className="login-title">Welcome Back</h2>
        <p className="subtitle">Sign in to continue your reading journey</p>

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

          <div
            className="forgot"
            onClick={() => {
              setShowForgot(!showForgot);
              setForgotMsg("");
            }}
          >
            Forgot password?
          </div>

          {showForgot && (
            <div className="forgot-panel">
              <p className="forgot-panel-title">
                Enter your email to reset password
              </p>
              <input
                type="email"
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="forgot-input"
              />
              <button
                type="button"
                className="forgot-btn"
                onClick={handleForgotPassword}
              >
                Send Reset Email
              </button>
              {forgotMsg && <p className="forgot-msg">{forgotMsg}</p>}
            </div>
          )}

          <button type="submit" className="login-btn">
            Get Started →
          </button>

          <div className="signup-text">
            Don't have an account?{" "}
            <span onClick={() => navigate("/signup")}>Sign up</span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
