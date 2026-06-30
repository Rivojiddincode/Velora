import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiEyeLine, RiEyeOffLine, RiMailLine, RiLockLine } from "react-icons/ri";
import "./SignIn.css";

const SignIn = () => {

  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    // Backendga ulaganda:
    // axios.post("/api/auth/login", formData)
  };

  return (
    <div className="signin">
      <div className="signin-card">

        <h1>Welcome Back</h1>
        <p>Sign in to continue to Velora Admin.</p>

        <form onSubmit={handleSubmit}>

          <div className="input-box">
            <RiMailLine className="icon" />

            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-box">
            <RiLockLine className="icon" />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />

            {showPassword ? (
              <RiEyeOffLine
                className="eye"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <RiEyeLine
                className="eye"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>

          <div className="signin-options">

            <label>
              <input type="checkbox" />
              Remember me
            </label>

            <Link to="/forgot-password">
              Forgot password?
            </Link>

          </div>

          <button onClick={()=>navigate("../client/Home.jsx") } type="submit">
            Sign In
          </button>

        </form>

        <div className="bottom-text">
          Don't have an account?
          <Link to="/signup"> Sign Up</Link>
        </div>

      </div>
    </div>
  );
};

export default SignIn;