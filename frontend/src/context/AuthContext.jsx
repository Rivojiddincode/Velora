import { createContext, useContext, useState } from "react";

// ✅ FIX: bu fayl umuman yo'q edi — yaratildi
// SignUp.jsx ichida useAuth() ishlatilgan, lekin context mavjud emasdi

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const signup = (userData) => {
    // Hozircha localStorage ga saqlanadi
    // Keyinchalik: axios.post("/api/auth/signup", userData)
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const signin = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const signout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signup, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
