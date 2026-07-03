import "./AdminHeader.sass";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { RiSearchLine } from "react-icons/ri";
import ThemeToggle from "../common/ThemeToggle";
import LanguageSwitcher from "../common/LanguageSwitcher";

const AdminHeader = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const titles = {
    dashboard: t("admin.dashboard"),
    products: t("admin.products"),
    orders: t("admin.orders"),
    users: t("admin.users"),
    settings: t("admin.settings"),
  };

  const page = location.pathname.split("/").pop();
  const pageTitle = titles[page] || t("admin.dashboard");
  const isDashboard = page === "dashboard" || page === "admin";
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const s = params.get("search") || "";
    setQ(s);
  }, [location.search]);

  const doSearch = () => {
    const base = "/admin/products";
    if (q && q.trim()) {
      navigate(`${base}?search=${encodeURIComponent(q.trim())}`);
    } else {
      navigate(base);
    }
  };

  return (
    <header className="admin-header">
      <div className="vt">
        <div className="header-logo">V</div>
        <div className="breadcrumb">
          <span className="breadcrumb__root">{t("admin.dashboard")}</span>
          {!isDashboard && (
            <>
              <span className="breadcrumb__slash">/</span>
              <span className="breadcrumb__current">{pageTitle}</span>
            </>
          )}
        </div>

        <div className="header-right">
          <div className="header-search">
            <input
              type="text"
              className="header-search__input"
              placeholder="Search products, orders..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && doSearch()}
            />
            <RiSearchLine className="header-search__icon" onClick={doSearch} style={{ cursor: "pointer" }} />
          </div>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
