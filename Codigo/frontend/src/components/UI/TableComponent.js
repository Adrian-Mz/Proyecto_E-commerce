import React from "react";
import {
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from "@coreui/react";

const TableComponent = ({ columns, data }) => {
  return (
    <CTable bordered small color="light" striped hover responsive>
      <CTableHead color="dark">
        <CTableRow>
          {columns.map((col) => (
            <CTableHeaderCell key={col.key}>{col.label}</CTableHeaderCell>
          ))}
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {data.map((item, index) => (
          <CTableRow key={index}>
            {columns.map((col) => (
              <CTableDataCell key={col.key}>{item[col.key]}</CTableDataCell>
            ))}
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  );
};

export default TableComponent;
