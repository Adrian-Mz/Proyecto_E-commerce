import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Header from "./components/UI/Header";
import Footer from "./components/UI/Footer";
import HomePage from "./pages/App/HomePage";
import ProductsPage from "./pages/App/ProductsPage";
import LoginPage from "./pages/App/LoginPage";
import RegisterPage from "./pages/App/RegisterPage";
import UserDashboardPage from "./pages/Client/UserDashboardPage";
import ProductoDetailPage from "./pages/App/ProductoDetailPage";
import CartPage from "./pages/App/CartPage";
import AdminPage from "./pages/Admin/AdminPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
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
            <Route
              path="/herramientas"
              element={<ProtectedRoute role="Administrador" Component={AdminDashboard} />}
            />
            <Route path="/productos/:id" element={<ProductoDetailPage />} />
            <Route path="/carrito" element={<CartPage />} />
            {/* Ruta 404 para toda la aplicación */}
            <Route
              path="*"
              element={
                <div className="text-center mt-20">
                  <h1 className="text-3xl font-bold text-red-500">404</h1>
                  <p className="text-lg text-gray-700">Página no disponible</p>
                </div>
              }
            />
          </Routes>
        </main>
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;
