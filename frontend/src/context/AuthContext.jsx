import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { getStoredUser, saveUserSession } from "../services/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("sfw_token")));

  useEffect(() => {
    const token = localStorage.getItem("sfw_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api.get("/auth/me")
      .then(res => setUser(res.data.user))
      .catch(() => {
        localStorage.removeItem("sfw_token");
        localStorage.removeItem("sfw_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async credentials => {
    const res = await api.post("/auth/login", credentials);
    saveUserSession(res.data.token, res.data.user);
    setUser(res.data.user);
    return res.data;
  };

  const register = async payload => {
    const res = await api.post("/auth/register", payload);
    saveUserSession(res.data.token, res.data.user);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("sfw_token");
    localStorage.removeItem("sfw_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
