import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import API from "../../api/api.jsx";
import "./Form.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;

const validateForm = ({ name, email, password }, t) => {
  if (!name.trim() || !email.trim() || !password) {
    return t("form.messages.allFieldsRequired");
  }

  if (name.trim().length < 2) {
    return t("form.messages.nameTooShort");
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    return t("form.messages.invalidEmail");
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return t("form.messages.passwordTooShort", { min: PASSWORD_MIN_LENGTH });
  }

  if (!/[A-Z]/.test(password)) {
    return t("form.messages.passwordNeedsUppercase");
  }

  if (!/[a-z]/.test(password)) {
    return t("form.messages.passwordNeedsLowercase");
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    return t("form.messages.passwordNeedsSpecial");
  }

  return null;
};

const Form = ({ setLoggedIn, setIsAdmin, closeModal, switchToLogin, switchToVerify }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const passwordChecks = [
    { label: t("form.passwordChecks.minLength"), met: form.password.length >= PASSWORD_MIN_LENGTH },
    { label: t("form.passwordChecks.uppercase"), met: /[A-Z]/.test(form.password) },
    { label: t("form.passwordChecks.lowercase"), met: /[a-z]/.test(form.password) },
    { label: t("form.passwordChecks.special"), met: /[^A-Za-z0-9]/.test(form.password) },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    const validationError = validateForm(form, t);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);

      await API.post("/auth/register", form);
      localStorage.setItem("pendingUser", JSON.stringify(form));
      setSuccess(t("form.messages.verificationSent"));

      setTimeout(() => {
        if (switchToVerify) {
          switchToVerify();
        }
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || t("form.messages.genericError"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="register-form-wrapper">
      <h1 className="form-title">{t("form.title")}</h1>
      <form className="register-form form-register-container" onSubmit={handleSubmit}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder={t("form.placeholders.name")}
          required
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder={t("form.placeholders.email")}
          required
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder={t("form.placeholders.password")}
          required
        />

        <ul className="form-password-hint">
          {passwordChecks.map((check) => (
            <li
              key={check.label}
              className={check.met ? "requirement-met" : "requirement-unmet"}
            >
              <span className="requirement-icon" aria-hidden="true">
                {check.met ? "✓" : "✗"}
              </span>
              {check.label}
            </li>
          ))}
        </ul>

        <button type="submit" disabled={submitting}>
          {submitting ? t("form.buttons.submitting") : t("form.buttons.submit")}
        </button>
      </form>

      {success && <p className="success form-success-msg">{success}</p>}
      {error && <p className="error form-error-msg">{error}</p>}

      <div className="form-footer">
        {t("form.footer.haveAccount")}{" "}
        <button
          type="button"
          onClick={switchToLogin}
          className="form-link-btn"
        >
          {t("form.footer.loginLink")}
        </button>
      </div>
    </div>
  );
};

export default Form;