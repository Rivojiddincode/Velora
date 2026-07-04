import { useTheme } from "./ThemeContext";
import { RiCheckLine, RiErrorWarningLine, RiCloseLine } from "react-icons/ri";
import "./Toast.css";

const Toast = ({ id, message, type, onClose }) => {
  const { isDark } = useTheme();

  return (
    <div className={`toast toast-${type} ${isDark ? "toast-dark" : "toast-light"}`}>
      <div className="toast-content">
        {type === "success" && <RiCheckLine className="toast-icon" />}
        {type === "error" && <RiErrorWarningLine className="toast-icon" />}
        <span>{message}</span>
      </div>
      <button
        type="button"
        className="toast-close"
        onClick={() => onClose(id)}
        aria-label="Close"
      >
        <RiCloseLine />
      </button>
    </div>
  );
};

export default Toast;
