import { RiCheckLine, RiHeartFill, RiCloseLine, RiErrorWarningLine } from "react-icons/ri";

const ICONS = {
  success: RiCheckLine,
  wishlist: RiHeartFill,
  error: RiErrorWarningLine,
};

const Toast = ({ id, message, type = "success", onClose }) => {
  const Icon = ICONS[type] || RiCheckLine;

  return (
    <div className={`toast toast-${type}`}>
      <Icon className="toast-icon" />
      <span className="toast-message">{message}</span>
      <button type="button" className="toast-close" onClick={() => onClose(id)} aria-label="Close">
        <RiCloseLine />
      </button>
    </div>
  );
};

export default Toast;