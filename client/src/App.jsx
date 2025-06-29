import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Movie from "./pages/Movies/Movie.jsx";
import Employee from "./pages/Employees/Employee.jsx";
import Client from "./pages/Clients/Client.jsx";
import Error from "./pages/Error/Error.jsx";
import Auth from "./pages/Auth/Auth.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import APITest from "./components/APITest/APITest.jsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import NotificationContainer from "./components/NotificationContainer/NotificationContainer.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import "./App.css";
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

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
          <Route
            path="movies"
            element={
              <ProtectedRoute>
                <Movie />
              </ProtectedRoute>
            }
          />
          <Route
            path="employees"
            element={
              <ProtectedRoute>
                <Employee />
              </ProtectedRoute>
            }
          />
          <Route
            path="clients"
            element={
              <ProtectedRoute>
                <Client />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Auth />} />
          <Route path="*" element={<Error />} />
        </Routes>

        <Footer />
        <NotificationContainer />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
