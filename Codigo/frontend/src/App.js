import React from 'react';
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import UsuariosPage from './pages/UsuarioPage';
import ProductosPage from './pages/ProductsPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/usuarios" element={<UsuariosPage />}/>
        <Route path="/productos" element={<ProductosPage />}/>
      </Routes>
    </Router>
  );
}

export default App;
