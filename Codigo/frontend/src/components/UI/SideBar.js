import React, { useState } from 'react';
import {
  CSidebar,
  CSidebarNav,
  CNavItem,
  CNavTitle,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilUser, cilCart, cilTags, cilSettings, cilHome, cilList} from '@coreui/icons';

const Sidebar = () => {
  // Estado para controlar el valor de `narrow`
  const [isNarrow, setIsNarrow] = useState(false);

  return (
    <div
      className="text-gray-100"
      onMouseEnter={() => setIsNarrow(false)} // Expande el sidebar al pasar el mouse
      onMouseLeave={() => setIsNarrow(true)} // Contrae el sidebar al quitar el mouse
    >
      <CSidebar size="sm" className="h-screen" narrow={isNarrow}>
        <CSidebarNav>
          <CNavTitle>Gestión de</CNavTitle>
          <CNavItem href="/admin">
            <CIcon customClassName="nav-icon" icon={cilHome} /> Inicio
          </CNavItem>
          <CNavItem href="/admin/productos">
            <CIcon customClassName="nav-icon" icon={cilList} /> Productos
          </CNavItem>
          <CNavItem href="/admin/categorias">
            <CIcon customClassName="nav-icon" icon={cilTags} /> Categorías
          </CNavItem>
          <CNavItem href="/admin/usuarios">
            <CIcon customClassName="nav-icon" icon={cilUser} /> Usuarios
          </CNavItem>
          <CNavItem href="/admin/pedidos">
            <CIcon customClassName="nav-icon" icon={cilCart} /> Pedidos
          </CNavItem>
          <CNavItem href="/admin/devoluciones">
            <CIcon customClassName="nav-icon" icon={cilSettings} /> Devoluciones
          </CNavItem>
        </CSidebarNav>
      </CSidebar>
    </div>
  );
};

export default Sidebar;
