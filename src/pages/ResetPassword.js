import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./Login.css";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    document.title = "Reset Password | SmartReadsML";
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMsg("❌ Passwords do not match.");
      return;
    }
    try {
      const response = await fetch(
        "https://smartreadsml-backend.onrender.com/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, password }),
        },
      );
      const data = await response.json();
      if (response.ok) {
        setMsg("✅ Password reset successfully!");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMsg("❌ " + (data.message || "Invalid or expired token."));
      }
    } catch (error) {
      setMsg("❌ Server error. Try again.");
    }
  };

  return (
    <div className="signup-bg reset-page">
      <div className="login-card">
        <div className="brand-header">
          <span className="brand-dot" />
          <span className="brand-name">SmartReadsML</span>
        </div>

        <h2 className="login-title">Reset Password</h2>
        <p className="subtitle">Enter your new password below</p>

        <form onSubmit={handleReset}>
          <div className="input-group">
            <label>New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {msg && <p className="forgot-msg">{msg}</p>}

          <button type="submit" className="login-btn reset-btn-glow">
            Reset Password →
          </button>

          <div className="signup-text">
            <span onClick={() => navigate("/login")}>Back to Login</span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
