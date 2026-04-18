import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, allowedRole, children }) => {
  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Wrong role trying to access
  if (allowedRole && user.role !== allowedRole) {
    return (
      <Navigate
        to={user.role === "student" ? "/student" : "/mentor"}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
