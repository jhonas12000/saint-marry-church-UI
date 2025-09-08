// import React, { createContext, useContext, useMemo, useState } from "react";
// import type { AuthResponse, AuthUser } from "./types";

// type AuthCtxValue = {
//   user: AuthUser | null;
//   signin: (resp: AuthResponse) => void;
//   signout: () => void;
// };

// const AuthCtx = createContext<AuthCtxValue | null>(null);
// export const useAuth = () => {
//   const ctx = useContext(AuthCtx);
//   if (!ctx) throw new Error("useAuth must be used within AuthProvider");
//   return ctx;
// };

// const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
//   const [user, setUser] = useState<AuthUser | null>(() => {
//     const raw = localStorage.getItem("auth_user");
//     return raw ? (JSON.parse(raw) as AuthUser) : null;
//   });

//   const signin = (resp: AuthResponse) => {
//     const { token, ...profile } = resp;
//     localStorage.setItem("auth_token", token);
//     localStorage.setItem("auth_user", JSON.stringify(profile));
//     setUser(profile);
//   };

//   const signout = () => {
//     localStorage.removeItem("auth_token");
//     localStorage.removeItem("auth_user");
//     setUser(null);
//   };

//   const value = useMemo(() => ({ user, signin, signout }), [user]);
//   return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
// };

// export default AuthProvider;

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
  signin: (data: AuthResponse) => void;
  signout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  // Rehydrate on refresh
  useEffect(() => {
    const u = localStorage.getItem("auth_user");
    if (u) setUser(JSON.parse(u));
  }, []);

  const signin = (data: AuthResponse) => {
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
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

