import React from 'react'
import {
  CSidebar,
  CSidebarBrand,
  CSidebarHeader,
  CSidebarNav,
  CNavItem,
  CNavTitle,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cilList, cilUser, cilCart, cilTags, cilSettings } from '@coreui/icons'

const Sidebar = () => {
  return (
    <CSidebar unfoldable className="border-end bg-gray-900 text-gray-100">
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand className="text-white text-lg">Admin Panel</CSidebarBrand>
      </CSidebarHeader>
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
  )
}

export default Sidebar
