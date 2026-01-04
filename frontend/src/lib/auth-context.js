"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authAPI, getAccessToken } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const token = getAccessToken();

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profile = await authAPI.getProfile();
        setUser(profile);
      } catch (err) {
        console.error("Auth restore failed", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login(email, password);
    setUser(res.user);
    return res;
  };

  const register = async (email, password, fullName) => {
    const res = await authAPI.register(email, password, fullName);
    setUser(res.user);
    return res;
  };

  const logout = async () => {
    await authAPI.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
