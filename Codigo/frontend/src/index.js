import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { SocketProvider } from './context/SocketContext';
import App from './App';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SocketProvider> {/* Aquí envuelves toda la app */}
      <App />
    </SocketProvider>
  </React.StrictMode>
);