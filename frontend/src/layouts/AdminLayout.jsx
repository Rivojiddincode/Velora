import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import AdminHeader from "../components/layout/AdminHeader";
import "./AdminLayout.css";

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="admin-main">
        <AdminHeader />

        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;