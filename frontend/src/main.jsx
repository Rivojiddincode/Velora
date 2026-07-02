import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // ✅ FIX: AuthProvider qo'shildi
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StrictMode>
      <AuthProvider>  {/* ✅ FIX: useAuth() ishlashi uchun kerak */}
        <App />
      </AuthProvider>
    </StrictMode>
  </BrowserRouter>
);
