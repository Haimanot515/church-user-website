import React, { useState } from "react";
import API from "../../api/api.jsx";
import "./Form.css"; // Added the CSS import

const Form = ({ setLoggedIn, setIsAdmin, closeModal, switchToLogin, switchToVerify }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    try {
      await API.post("/auth/register", form);
      localStorage.setItem("pendingUser", JSON.stringify(form));
      setSuccess("Verification code sent! Switching...");
      
      setTimeout(() => {
        if (switchToVerify) {
          switchToVerify();
        }
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <>
      <h1 className="form-title">Register</h1>
      <form className="register-form form-register-container" onSubmit={handleSubmit}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <button type="submit">Register</button>
      </form>

      {success && <p className="success form-success-msg">{success}</p>}
      {error && <p className="error form-error-msg">{error}</p>}

      <div className="form-footer">
        Already have an account?{" "}
        <button 
          type="button" 
          onClick={switchToLogin} 
          className="form-link-btn"
        >
          Login here
        </button>
      </div>
    </>
  );
};

export default Form;
