import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api"; 
import { FaTimes } from "react-icons/fa";

const Verify = ({ setLoggedIn, setIsAdmin, closeModal }) => {
  const [code, setCode] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleVerification = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    try {
      const pendingUser = localStorage.getItem("pendingUser");
      if (!pendingUser) {
        setError("No registration data found.");
        return;
      }

      const { name, email, password } = JSON.parse(pendingUser);

      const res = await API.post("/auth/verify", {
        name,
        email,
        password,
        code: code.toString(),
      });

      const { token, msg } = res.data;

      // 1. Store the token
      localStorage.removeItem("pendingUser");
      localStorage.setItem("token", token);

      // 2. Decode the token payload 🔓
      const payload = JSON.parse(atob(token.split(".")[1]));

      // 3. Strict Check: Handles both boolean true and string "true" 🛡️
      const adminFlag = payload.isAdmin === true || payload.isAdmin === "true";

      // 4. Update the global states
      setLoggedIn(true);
      setIsAdmin(adminFlag); 
      setSuccess(msg);

      // Successfully verified: close the box and navigate home
      setTimeout(() => {
        if (closeModal) closeModal();
        navigate("/home"); 
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Verification failed. Try again.");
    }
  };

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2 style={{ marginBottom: "20px", color: "#333", fontWeight: 600 }}>
        Verify Your Account
      </h2>

      <form
        onSubmit={handleVerification}
        style={{ width: "100%", display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <label
          htmlFor="code"
          style={{
            fontSize: "14px",
            fontWeight: 500,
            color: "#555",
            textAlign: "left",
          }}
        >
          Enter 6-digit code
        </label>

        <input
          id="code"
          name="code"
          type="text"
          inputMode="numeric"
          pattern="\d{6}"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="123456"
          required
          style={{
            padding: "12px 15px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            outline: "none",
            transition: "border 0.3s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#007bff")}
          onBlur={(e) => (e.target.style.borderColor = "#ccc")}
        />

        <button
          type="submit"
          style={{
            padding: "12px 0",
            fontSize: "16px",
            fontWeight: 600,
            color: "#fff",
            backgroundColor: "#007bff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "background 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
        >
          Verify
        </button>

        {success && <p style={{ color: "green", textAlign: "center" }}>{success}</p>}
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      </form>

     
    </div>
  );
};

export default Verify;
