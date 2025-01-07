import React from "react";
import { CCard, CCardBody, CCardImage, CCardText, CCardTitle, CCol, CRow } from "@coreui/react";

export const CardGrid3Example = () => {
  return (
    <CRow xs={{ cols: 1 }} md={{ cols: 3 }} className="g-4">
      <CCol xs>
        <CCard className="h-100 bg-gray-800 text-gray-100">
          <CCardImage orientation="top" src="../../images/react.jpg" />
          <CCardBody>
            <CCardTitle>Laptops</CCardTitle>
            <CCardText>Explora nuestra amplia gama de laptops de última generación.</CCardText>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs>
        <CCard className="h-100 bg-gray-800 text-gray-100">
          <CCardImage orientation="top" src="../../images/vue.jpg" />
          <CCardBody>
            <CCardTitle>Gaming</CCardTitle>
            <CCardText>Descubre accesorios y consolas para mejorar tu experiencia gaming.</CCardText>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs>
        <CCard className="h-100 bg-gray-800 text-gray-100">
          <CCardImage orientation="top" src="../../images/angular.jpg" />
          <CCardBody>
            <CCardTitle>Accesorios</CCardTitle>
            <CCardText>Encuentra los accesorios perfectos para complementar tus gadgets.</CCardText>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};
