

import React, { createContext, useContext, useEffect, useState } from "react";
import type { Role, AuthResponse } from "./types";

export type AuthUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  roles: Role[];
};

type AuthContextType = {
  user: AuthUser | null;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  signin: (data: AuthResponse) => void;
  signout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Rehydrate on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("auth_user");
    const storedToken = localStorage.getItem("auth_token");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        // Corrupt storage; clear it
        localStorage.removeItem("auth_user");
      }
    }
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const signin = (data: AuthResponse) => {
    // Persist
    localStorage.setItem("auth_token", data.token);
    localStorage.setItem(
      "auth_user",
      JSON.stringify({
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone ?? null,
        roles: data.roles,
      })
    );

    // Context state
    setToken(data.token);
    setUser({
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone ?? null,
      roles: data.roles,
    });
  };

  const signout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
