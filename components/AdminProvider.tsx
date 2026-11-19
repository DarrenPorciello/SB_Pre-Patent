"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { listSessions } from "@/lib/sessions";

const ADMIN_KEY = "scotia-prepatent-admin";

const AdminContext = createContext<{
  ready: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}>({
  ready: false,
  isAdmin: false,
  login: () => false,
  logout: () => {},
});

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    listSessions();
    setIsAdmin(localStorage.getItem(ADMIN_KEY) === "1");
    setReady(true);
  }, []);

  const login = (username: string, password: string) => {
    if (username !== "username" || password !== "password") return false;
    localStorage.setItem(ADMIN_KEY, "1");
    setIsAdmin(true);
    return true;
  };

  const logout = () => {
    localStorage.removeItem(ADMIN_KEY);
    setIsAdmin(false);
  };

  return (
    <AdminContext.Provider value={{ ready, isAdmin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
