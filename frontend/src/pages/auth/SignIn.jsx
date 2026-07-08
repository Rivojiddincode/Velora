import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { RiEyeLine, RiEyeOffLine, RiMailLine, RiLockLine } from "react-icons/ri";
import { useAuth } from "../../context/AuthContext";
import "./Signin.css";

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { signin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await signin(formData);
      const redirectTo = location.state?.from || (user.role === "admin" ? "/admin" : "/");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || t("auth.errorGeneric"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin">
      <div className="signin-card">
        <h1>{t("auth.signin")}</h1>
        <p>{t("auth.loginRequired")}</p>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <RiMailLine className="icon" />
            <input
              type="email"
              name="email"
              placeholder={t("auth.email")}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-box">
            <RiLockLine className="icon" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder={t("auth.password")}
              value={formData.password}
              onChange={handleChange}
              required
            />
            {showPassword ? (
              <RiEyeOffLine className="eye" onClick={() => setShowPassword(false)} />
            ) : (
              <RiEyeLine className="eye" onClick={() => setShowPassword(true)} />
            )}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? t("auth.loading") : t("auth.signin")}
          </button>
        </form>

        <div className="bottom-text">
          {t("auth.noAccount")}
          <Link to="/signup"> {t("auth.signup")}</Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
