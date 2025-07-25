import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Movie from "./pages/Movies/Movie.jsx";
import MovieDetail from "./pages/Movies/MovieDetail.jsx";
import Employee from "./pages/Employees/Employee.jsx";
import Client from "./pages/Clients/Client.jsx";
import Error from "./pages/Error/Error.jsx";
import Auth from "./pages/Auth/Auth.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import APITest from "./components/APITest/APITest.jsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import RoleGuard from "./components/RoleGuard/RoleGuard.jsx";
import NotificationContainer from "./components/NotificationContainer/NotificationContainer.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import "./App.css";
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Roles from "./pages/Roles/Roles";
import Genres from "./pages/Genres/Genres";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";

  return (
    <>
      {!isAuthPage && <Navbar />}

      <Routes>
        <Route path="auth" element={<Auth />} />
        <Route path="test" element={<APITest />} />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="movies" element={<Movie />} />
        <Route path="movies/:id" element={<MovieDetail />} />
        <Route
          path="employees"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["Admin", "Manager"]}>
                <Employee />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="clients"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["Admin", "Manager"]}>
                <Client />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Movie />} />
        <Route
          path="roles"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["Admin"]}>
                <Roles />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="genres"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["Admin", "Manager"]}>
                <Genres />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route path="privacy" element={<Privacy />} />
        <Route path="terms" element={<Terms />} />
        <Route path="*" element={<Error />} />
      </Routes>

      {!isAuthPage && <Footer />}
      <NotificationContainer />
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
