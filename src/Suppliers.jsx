import React, { useState } from "react";
import styles from "./styles/Suppliers.module.css";
import { suppliersData } from "./data/suppliersData";
import EditSupplierForm from "./editSupplierForm";

function Suppliers() {
  const [suppliers, setSuppliers] = useState(suppliersData);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const handleEditClick = (supplier) => {
    setEditingSupplier(supplier);
  };

  const handleCloseEdit = () => {
    setEditingSupplier(null);
  };

  const handleSaveEdit = (editedSupplier) => {
    setSuppliers((prevSuppliers) =>
      prevSuppliers.map((supplier) =>
        supplier.id === editedSupplier.id ? editedSupplier : supplier
      )
    );
    setEditingSupplier(null);
  };
  return (
    <div className={styles.supplierContainer}>
      <SearchSuppliers />
      <CurrentSupplier suppliers={suppliers} onEditClick={handleEditClick} />
      <NewSupplierButton />
      {editingSupplier && (
        <EditSupplierForm
          supplier={editingSupplier}
          onClose={handleCloseEdit}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}

function CurrentSupplier({ suppliers, onEditClick }) {
  return (
    <div className={styles.currentSupplierContainer}>
      <h2>Current Suppliers</h2>
      <ul className={styles.currentSupplierList}>
        {suppliers.map((supplier) => (
          <li key={supplier.id} className={styles.currentSupplierItem}>
            <span>{supplier.name}</span>
            <button className={styles.ordersButton}>View Orders</button>
            <button
              className={styles.ordersButton}
              onClick={() => onEditClick(supplier)}
            >
              Edit Supplier
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SearchSuppliers() {
  return (
    <div className={styles.searchSuppliersContainer}>
      <h2>Search Suppliers</h2>
      <div className={styles.search}>
        <input type="text" />
        <input type="submit" />
      </div>
    </div>
  );
}

function NewSupplierButton() {
  return (
    <button className={styles.newSupplierButton}>Create a new supplier</button>
  );
}

export default Suppliers;
