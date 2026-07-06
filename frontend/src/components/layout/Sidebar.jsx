import "./Sidebar.sass";
import adminLogo from "../../assets/gggg.webp"
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { RiHomeLine, RiShoppingBagLine, RiArrowRightSLine, RiFileList3Line, RiUser3Line, RiSettings4Line, RiLogoutBoxRLine, RiStackLine } from "react-icons/ri";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { signout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signout();
    navigate("/");
  };

  return (
    <>
      <div className={`sidebar-backdrop ${isOpen ? "show" : ""}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="logo">
          <div className="logo-wrapper">
          <img src={adminLogo}
          alt="adminLogo"
          loading="lazy"/>
          </div>
        </div>
        <p>MAIN MENU</p>
        <div className="navigation">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
            onClick={onClose}
          >
            <RiHomeLine />
            <span>{t("admin.dashboard")}</span>
          </NavLink>

  <NavLink
    to="/admin/products"
    className={({ isActive }) =>
      isActive ? "nav-item active" : "nav-item"
    }
    onClick={onClose}
  >
    <RiShoppingBagLine />
    <span>{t("admin.products")}</span>
    <RiArrowRightSLine className="arrow" />
  </NavLink>
  <NavLink
    to="/admin/categories"
    className={({ isActive }) =>
      isActive ? "nav-item active" : "nav-item"
    }
    onClick={onClose}
  >
    <RiStackLine />
    <span>{t("admin.categories")}</span>
    <RiArrowRightSLine className="arrow" />
  </NavLink>
  <NavLink
    to="/admin/orders"
    className={({ isActive }) =>
      isActive ? "nav-item active" : "nav-item"
    }
    onClick={onClose}
  >
    <RiFileList3Line />
    <span>{t("admin.orders")}</span>

  </NavLink>
  <NavLink
    to="/admin/settings"
    className={({ isActive }) =>
      isActive ? "nav-item active" : "nav-item"
    }
    onClick={onClose}
  >
    <RiSettings4Line />
    <span>{t("admin.settings")}</span>

  </NavLink>
  <NavLink
    to="/admin/users"
    className={({ isActive }) =>
      isActive ? "nav-item active" : "nav-item"
    }
    onClick={onClose}
  >
    <RiUser3Line />
    <span>{t("admin.users")}</span>
  </NavLink>
        </div>

        <div className="sidebar-footer">
          <NavLink to="/" className="nav-item footer-item" onClick={onClose}>
            <RiHomeLine />
            <span>{t("nav.home")}</span>
          </NavLink>
          <button type="button" className="nav-item footer-item" onClick={handleLogout}>
            <RiLogoutBoxRLine />
            <span>{t("nav.signout")}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
