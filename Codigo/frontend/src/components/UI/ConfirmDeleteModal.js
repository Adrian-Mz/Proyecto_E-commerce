import React from "react";
import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CButton } from "@coreui/react";

const ConfirmDeleteModal = ({ title = "Confirmación de Eliminación", message, visible, onClose, onConfirm }) => {
  return (
    <CModal alignment="center" visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>{title}</CModalTitle>
      </CModalHeader>
      <CModalBody>{message || "¿Estás seguro de que deseas eliminar este elemento?"}</CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          No
        </CButton>
        <CButton color="danger" onClick={onConfirm}>
          Sí, eliminar
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default ConfirmDeleteModal;
