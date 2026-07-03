import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";

import "./SignUp.sass";

function SignUp() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const created = await signup(user);
      const redirectTo = location.state?.from || (created.role === "admin" ? "/admin" : "/");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="box">
      <div className="cont">
        <form onSubmit={handleSubmit}>
          <p>{t("auth.signup")}</p>

          {error && <div className="form-error">{error}</div>}

          <label>
            {t("auth.name")}
            <input
              type="text"
              placeholder={t("auth.name")}
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              required
            />
          </label>

          <label>
            {t("auth.email")}
            <input
              type="email"
              placeholder={t("auth.email")}
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
            />
          </label>

          <label>
            {t("auth.phone")}
            <input
              type="tel"
              placeholder="+998 90 000 00 00"
              value={user.phone}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
            />
          </label>

          <label>
            {t("auth.password")}
            <input
              type="password"
              placeholder={t("auth.password")}
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required
              minLength={6}
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "..." : t("auth.signup")}
          </button>
        </form>
        <div className="divider">
          <span>OR</span>
        </div>
        <p className="switch-link" onClick={() => navigate("/signin")}>
          {t("auth.haveAccount")} <span>{t("auth.signin").toUpperCase()}</span>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
