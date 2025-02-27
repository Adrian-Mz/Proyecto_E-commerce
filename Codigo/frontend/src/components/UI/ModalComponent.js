import React from 'react';
import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CButton } from '@coreui/react';

const ModalComponent = ({ title, visible, onClose, children, onSave }) => {
  return (
    <CModal alignment="center" visible={visible} onClose={onClose} size="xl">
      <CModalHeader>
        <CModalTitle>{title}</CModalTitle>
      </CModalHeader>
      <CModalBody>{children}</CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Cerrar
        </CButton>
        {onSave && (
          <CButton color="primary" onClick={onSave}>
            Enviar
          </CButton>
        )}
      </CModalFooter>
    </CModal>
  );
};

export default ModalComponent;
