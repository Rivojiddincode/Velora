import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Home sahifasidan tashqari har qanday sahifaga o'tishga urinilganda,
// foydalanuvchi tizimga kirmagan bo'lsa — signup sahifasiga yo'naltiriladi.
const ProtectedRoute = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/signup" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
