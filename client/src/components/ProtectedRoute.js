import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, allowedType, children }) => {
  // Not logged in
  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }

  // Wrong user type trying to access the route
  if (allowedType && user.userType !== allowedType) {
    return (
      <Navigate
        to={user.userType === "student" ? "/student" : "/mentor"}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
