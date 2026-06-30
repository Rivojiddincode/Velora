import "./Sidebar.sass";
import adminLogo from "../../assets/gggg.webp"
import { NavLink } from "react-router-dom";
import { RiHomeLine, RiShoppingBagLine, RiArrowRightSLine, RiFileList3Line, RiUser3Line, RiSettings4Line, RiLogoutBoxRLine } from "react-icons/ri";
const Sidebar = () => {
  return (
    <aside className="sidebar">
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
        >
          <RiHomeLine />
          <span>Dashboard</span>
        </NavLink>

<NavLink
  to="/admin/products"
  className={({ isActive }) =>
    isActive ? "nav-item active" : "nav-item"
  }
>
  <RiShoppingBagLine />
  <span>Products</span>
  <RiArrowRightSLine className="arrow" />
</NavLink>
<NavLink
  to="/admin/orders"
  className={({ isActive }) =>
    isActive ? "nav-item active" : "nav-item"
  }
>
  <RiFileList3Line />
  <span>Orders</span>
 
</NavLink>
<NavLink
  to="/admin/settings"
  className={({ isActive }) =>
    isActive ? "nav-item active" : "nav-item"
  }
>
  <RiSettings4Line />
  <span>Settings</span>
 
</NavLink>
<NavLink
  to="/admin/users"
  className={({ isActive }) =>
    isActive ? "nav-item active" : "nav-item"
  }
>
  <RiUser3Line />
  <span>Users</span>
</NavLink>
      </div>

      <div className="sidebar-footer">
        <NavLink to="/" className="nav-item footer-item">
          <RiHomeLine />
          <span>Home Page</span>
        </NavLink>
        <NavLink to="/signin" className="nav-item footer-item">
          <RiLogoutBoxRLine />
          <span>Logout</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;