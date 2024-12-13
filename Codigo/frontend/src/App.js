import React from 'react';
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import UsuariosPage from './pages/UsuarioPage';
import ProductosPage from './pages/ProductsPage';
import Header from './components/Header';
import './App.css';

function App() {
  return (
    <Router>
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto py-8">
        <Routes>
          {/* Rutas dinámicas */}
          <Route path="/usuarios" element={<UsuariosPage />} />
          <Route path="/productos" element={<ProductosPage />} />
          <Route
            path="/"
            element={
              <div className="text-center">
                <h1 className="text-3xl font-bold">Bienvenido al E-Commerce</h1>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  </Router>
  );
}

export default App;
