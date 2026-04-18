import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import MentorDashboard from "./pages/MentorDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <Router>
      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}
        <Route
          path="/login"
          element={
            !user ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Navigate
                to={user.role === "student" ? "/student" : "/mentor"}
              />
            )
          }
        />

        <Route
          path="/register"
          element={
            !user ? (
              <Register />
            ) : (
              <Navigate
                to={user.role === "student" ? "/student" : "/mentor"}
              />
            )
          }
        />

        {/* ================= STUDENT ROUTE ================= */}
        <Route
          path="/student"
          element={
            <ProtectedRoute user={user} allowedRole="student">
              <StudentDashboard
                user={user}
                onLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        />

        {/* ================= MENTOR ROUTE ================= */}
        <Route
          path="/mentor"
          element={
            <ProtectedRoute user={user} allowedRole="mentor">
              <MentorDashboard
                user={user}
                onLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        />

        {/* ================= DEFAULT ROUTE ================= */}
        <Route
          path="/"
          element={
            <Navigate
              to={
                user
                  ? user.role === "student"
                    ? "/student"
                    : "/mentor"
                  : "/login"
              }
            />
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
