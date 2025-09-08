import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import type { Role } from "./types";

type Props = {
  children: React.ReactElement;
  roles?: Role[];
};

const ProtectedRoute: React.FC<Props> = ({ children, roles }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }
  if (roles && !roles.some((r) => user.roles?.includes(r))) {
    return <Navigate to="/forbidden" replace />;
  }
  return children;
};

export default ProtectedRoute;
