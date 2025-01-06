import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/UI/Header";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import ProductoDetailPage from "./pages/ProductoDetailPage";

function App() {
  return (
    <Router>
      <Header />
      <main className="min-h-screen bg-gray-900 text-gray-100">
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard/*" element={<UserDashboardPage />} />
          <Route path="/productos/:id" element={<ProductoDetailPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;