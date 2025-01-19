import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Header from "./components/UI/Header";
import Footer from "./components/UI/Footer";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import ProductoDetailPage from "./pages/ProductoDetailPage";
import CartPage from "./pages/CartPage";
import AdminPage from "./pages/AdminPage";
import ProtectedRoute from "./components/UI/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <CartProvider>
      <Router>
        <Header />
        <main className="min-h-screen bg-gray-900 text-gray-100">
          <ToastContainer />
          <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route path="/productos" element={<ProductsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/dashboard/*"
              element={<ProtectedRoute role="Usuario" Component={UserDashboardPage} />}
            />
            <Route
              path="/admin/*"
              element={<ProtectedRoute role="Administrador" Component={AdminPage} />}
            />
            <Route path="/productos/:id" element={<ProductoDetailPage />} />
            <Route path="/carrito" element={<CartPage />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;
