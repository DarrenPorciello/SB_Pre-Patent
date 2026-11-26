"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { listSessions } from "@/lib/sessions";

const ADMIN_KEY = "scotia-prepatent-admin";

const AdminContext = createContext<{
  ready: boolean;
  isAdmin: boolean;
  enterAdmin: () => void;
  logout: () => void;
}>({
  ready: false,
  isAdmin: false,
  enterAdmin: () => {},
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

  const enterAdmin = () => {
    localStorage.setItem(ADMIN_KEY, "1");
    setIsAdmin(true);
  };

  const logout = () => {
    localStorage.removeItem(ADMIN_KEY);
    setIsAdmin(false);
  };

  return (
    <AdminContext.Provider value={{ ready, isAdmin, enterAdmin, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
