import React, { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import MentorLogin from "./pages/MentorLogin";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import MentorDashboard from "./pages/MentorDashboard";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [user, setUser] = useState(() => {
    const token    = localStorage.getItem("token");
    const userType = localStorage.getItem("userType"); // "student" | "mentor"
    return token ? { token, userType } : null;
  });

  const handleLogin = ({ token, userType }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userType", userType);
    setUser({ token, userType });
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
  };

  return (
    <ThemeProvider>
    <Router>
      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}

        <Route
          path="/register"
          element={
            !user ? (
              <Register />
            ) : (
              <Navigate to={user.userType === "student" ? "/student" : "/mentor"} />
            )
          }
        />

        {/* Student Login */}
        <Route
          path="/login"
          element={
            !user ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Navigate to={user.userType === "student" ? "/student" : "/mentor"} />
            )
          }
        />

        {/* Mentor Login */}
        <Route
          path="/mentor-login"
          element={
            !user ? (
              <MentorLogin onLogin={handleLogin} />
            ) : (
              <Navigate to="/mentor" />
            )
          }
        />

        {/* ================= STUDENT ROUTE ================= */}
        <Route
          path="/student"
          element={
            <ProtectedRoute user={user} allowedType="student">
              <StudentDashboard
                token={user?.token}
                onLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        />

        {/* ================= MENTOR ROUTE ================= */}
        <Route
          path="/mentor"
          element={
            <ProtectedRoute user={user} allowedType="mentor">
              <MentorDashboard
                token={user?.token}
                onLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        />

        {/* ================= DEFAULT ROUTE ================= */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate to={user.userType === "student" ? "/student" : "/mentor"} />
            ) : (
              <LandingPage />
            )
          }
        />

      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;
