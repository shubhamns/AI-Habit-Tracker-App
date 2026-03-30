import { createContext, useContext, useEffect, useMemo, useState } from "react";

import api from "../axios/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("habit-tracker-user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("habit-tracker-token"));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem("habit-tracker-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("habit-tracker-user");
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("habit-tracker-token", token);
    } else {
      localStorage.removeItem("habit-tracker-token");
    }
  }, [token]);

  const authenticate = async (path, payload) => {
    setLoading(true);
    try {
      const { data } = await api.post(path, payload);
      setUser(data.user);
      setToken(data.access_token);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token),
      login: (payload) => authenticate("/login", payload),
      register: (payload) => authenticate("/register", payload),
      logout: () => {
        setUser(null);
        setToken(null);
      },
    }),
    [loading, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
