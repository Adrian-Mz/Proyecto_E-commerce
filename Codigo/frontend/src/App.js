import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Header from "./components/UI/Header";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import ProductoDetailPage from "./pages/ProductoDetailPage";
import CartPage from "./pages/CartPage";
import AdminPage from "./pages/AdminPage";
import ProtectedRoute from "./components/UI/ProtectedRoute";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <CartProvider>
      <Router>
        <Header />
        <main className="min-h-screen bg-gray-900 text-gray-100">
          <ToastContainer />
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/home" element={<HomePage />} />
            <Route path="/productos" element={<ProductsPage />} />
            <Route path="/productos/:id" element={<ProductoDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Rutas del Usuario Logueado */}
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <UserDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/carrito"
              element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              }
            />

            {/* Rutas del Administrador */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="Administrador">
                  <AdminPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </Router>
    </CartProvider>
  );
}

export default App;