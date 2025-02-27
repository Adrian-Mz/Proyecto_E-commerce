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
import AboutPage from "./pages/App/AboutPage";
import CartPage from "./pages/App/CartPage";
import AdminPage from "./pages/Admin/AdminPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import UserReportPage from "./pages/Client/UserReportPage";
import ProtectedRoute from "./components/UI/ProtectedRoute";
import NotificacionesPage from "./pages/App/NotificacionesPage";
import NotFoundPage from "./pages/App/NotFoundPage";
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
            <Route path="/notificaciones" element={<NotificacionesPage />} />
            <Route path="/nosotros" element={<AboutPage />} />

            <Route
              path="/dashboard/*"
              element={<ProtectedRoute role="Usuario" Component={UserDashboardPage} />}
            />
            <Route
              path="/admin/*"
              element={<ProtectedRoute role="Administrador" Component={AdminPage} />}
            />
            {/* Rutas de Reportes según rol */}
            <Route
              path="/reportes/admin"
              element={<ProtectedRoute role="Administrador" Component={AdminDashboard} />}
            />
            <Route
              path="/reportes/usuario"
              element={<ProtectedRoute role="Usuario" Component={UserReportPage} />}
            />
            <Route path="/productos/:id" element={<ProductoDetailPage />} />
            <Route path="/carrito" element={<CartPage />} />
            {/* Ruta 404 para toda la aplicación */}
            <Route
              path="*" element={ <NotFoundPage />}
            />
          </Routes>
        </main>
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;
