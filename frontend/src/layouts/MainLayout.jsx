import { NavLink, Outlet } from "react-router-dom";
import adminLogo from "../assets/gggg.webp";

const MainLayout = () => {
  return (
    <div className="main-layout">
      <header className="main-header">
        <div className="main-brand">
          <NavLink to="/" className="brand-link">
            <img src={adminLogo} alt="Velora" className="main-logo" />
            <span>Velora</span>
          </NavLink>
        </div>

        <nav className="main-nav">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/cart">Cart</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/signin">Sign In</NavLink>
        </nav>
      </header>

      <main className="page-content">
        <Outlet />
      </main>

      <footer className="main-footer">
        © 2026 Velora Store — Modern shopping experience for every client.
      </footer>
    </div>
  );
};

export default MainLayout;
