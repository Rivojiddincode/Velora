import { Outlet } from "react-router-dom";

// ✅ FIX: fayl bo'sh edi — to'ldirildi
const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
