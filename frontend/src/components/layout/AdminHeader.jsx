import "./AdminHeader.sass";
import { useLocation } from "react-router-dom";
import { RiSearchLine } from "react-icons/ri";

const AdminHeader = () => {
  const location = useLocation();

  const titles = {
    dashboard: "Dashboard",
    products: "Products",
    orders: "Orders",
    users: "Users",
    categories: "Categories",
    coupons: "Coupons",
    analytics: "Analytics",
    reviews: "Reviews",
    settings: "Settings",
  };

  const page = location.pathname.split("/").pop();
  const pageTitle = titles[page] || "Dashboard";
  const isDashboard = page === "dashboard" || page === "admin";

  return (
    <header className="admin-header">
      <div className="breadcrumb">
        <span className="breadcrumb__root">Dashboard</span>
        {!isDashboard && (
          <>
            <span className="breadcrumb__slash">/</span>
            <span className="breadcrumb__current">{pageTitle}</span>
          </>
        )}
      </div>

      <div className="header-search">
        {/* Icon inputdan KEYIN — CSS :focus + selector ishlashi uchun */}
        <input
          type="text"
          className="header-search__input"
          placeholder="Search products, orders..."
        />
        <RiSearchLine className="header-search__icon" />
      </div>
    </header>
  );
};

export default AdminHeader;