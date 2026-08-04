import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import API from "../api/api.jsx";
import "./login.css";

const Login = ({ setLoggedIn, setIsAdmin, closeModal, switchToRegister }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);

      const payload = JSON.parse(atob(res.data.token.split(".")[1]));
      const adminFlag =
        payload.isAdmin === true || payload.isAdmin === "true";

      setLoggedIn(true);
      setIsAdmin(adminFlag);

      setSuccess(t("login.messages.loginSuccess"));
      setError("");

      // Close the popup only (NO REDIRECT)
      setTimeout(() => {
        if (closeModal) closeModal();
      }, 1000);

    } catch (err) {
      const errorMsg =
        err.response?.data?.msg || t("login.messages.genericError");

      setSuccess("");

      if (
        errorMsg.toLowerCase().includes("user not found") ||
        errorMsg.toLowerCase().includes("not registered")
      ) {
        setError(t("login.messages.accountNotFound"));

        setTimeout(() => {
          if (switchToRegister) switchToRegister();
        }, 1500);
      } else {
        setError(errorMsg);
      }
    }
  };

  return (
    <div className="login-overlay" onClick={closeModal}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <h1 className="login-title">{t("login.title")}</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder={t("login.placeholders.email")}
            required
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder={t("login.placeholders.password")}
            required
          />

          <button type="submit">{t("login.buttons.submit")}</button>
        </form>

        {success && <p className="success login-success-msg">{success}</p>}
        {error && <p className="error login-error-msg">{error}</p>}

        <div className="login-footer">
          {t("login.footer.noAccount")}{" "}
          <button
            type="button"
            onClick={switchToRegister}
            className="login-link-btn"
          >
            {t("login.footer.registerLink")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;