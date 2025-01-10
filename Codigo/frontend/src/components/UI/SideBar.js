import React, { useState } from 'react';
import {
  CSidebar,
  CSidebarNav,
  CNavItem,
  CNavTitle,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilList, cilUser, cilCart, cilTags, cilSettings } from '@coreui/icons';

const Sidebar = () => {
  // Estado para controlar el valor de `narrow`
  const [isNarrow, setIsNarrow] = useState(false);

  return (
    <div
      className="bg-gray-900 text-gray-100 h-full shadow-lg"
      onMouseEnter={() => setIsNarrow(false)} // Expande el sidebar al pasar el mouse
      onMouseLeave={() => setIsNarrow(true)} // Contrae el sidebar al quitar el mouse
    >
      <CSidebar size="md" className="h-screen" narrow={isNarrow}>
        <CSidebarNav>
          <CNavTitle>Administración</CNavTitle>
          <CNavItem href="/admin/productos">
            <CIcon customClassName="nav-icon" icon={cilList} /> Gestión de Productos
          </CNavItem>
          <CNavItem href="/admin/categorias">
            <CIcon customClassName="nav-icon" icon={cilTags} /> Gestión de Categorías
          </CNavItem>
          <CNavItem href="/admin/usuarios">
            <CIcon customClassName="nav-icon" icon={cilUser} /> Gestión de Usuarios
          </CNavItem>
          <CNavItem href="/admin/pedidos">
            <CIcon customClassName="nav-icon" icon={cilCart} /> Gestión de Pedidos
          </CNavItem>
          <CNavItem href="/admin/devoluciones">
            <CIcon customClassName="nav-icon" icon={cilSettings} /> Gestión de Devoluciones
          </CNavItem>
        </CSidebarNav>
      </CSidebar>
    </div>
  );
};

export default Sidebar;
