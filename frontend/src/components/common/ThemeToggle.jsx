import { RiSunLine, RiMoonLine } from "react-icons/ri";
import { useTheme } from "../../context/ThemeContext";
import "./ThemeToggle.css";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      className="theme-toggle-btn"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={theme === "dark" ? "Light mode" : "Dark mode"}
    >
      {theme === "dark" ? <RiSunLine /> : <RiMoonLine />}
    </button>
  );
};

export default ThemeToggle;