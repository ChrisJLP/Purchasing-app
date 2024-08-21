import React, { createContext, useState, useContext } from "react";
import { suppliersData } from "./data/suppliersData";

const SupplierContext = createContext();

export function SupplierProvider({ children }) {
  const [suppliers, setSuppliers] = useState(suppliersData);

  const addSupplier = (newSupplier) => {
    const newSupplierId = Math.max(...suppliers.map((s) => s.id)) + 1;
    const supplierToAdd = {
      ...newSupplier,
      id: newSupplierId,
    };
    setSuppliers((prevSuppliers) => [...prevSuppliers, supplierToAdd]);
  };

  const updateSupplier = (updatedSupplier) => {
    setSuppliers((prevSuppliers) =>
      prevSuppliers.map((supplier) =>
        supplier.id === updatedSupplier.id ? updatedSupplier : supplier
      )
    );
  };

  const deleteSupplier = (supplierId) => {
    setSuppliers((prevSuppliers) =>
      prevSuppliers.filter((s) => s.id !== supplierId)
    );
  };

  return (
    <SupplierContext.Provider
      value={{ suppliers, addSupplier, updateSupplier, deleteSupplier }}
    >
      {children}
    </SupplierContext.Provider>
  );
}

export function useSupplier() {
  return useContext(SupplierContext);
}
