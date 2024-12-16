import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/UI/Header";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <Router>
      <Header />
      <main className="min-h-screen bg-gray-900 text-gray-100">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;