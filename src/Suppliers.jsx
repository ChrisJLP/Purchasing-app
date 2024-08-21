import React, { useState } from "react";
import styles from "./styles/Suppliers.module.css";
import { suppliersData } from "./data/suppliersData";
import EditSupplierForm from "./editSupplierForm";
import SupplierOrdersView from "./SuppliersOrdersView";
import NewSupplierForm from "./NewSupplierForm";
import { useOrder } from "./OrderContext";

function Suppliers() {
  const [suppliers, setSuppliers] = useState(suppliersData);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [viewingOrdersSupplier, setViewingOrdersSupplier] = useState(null);
  const [isCreatingNewSupplier, setIsCreatingNewSupplier] = useState(false);
  const [deletedSupplierName, setDeletedSupplierName] = useState(null);
  const { currentOrders } = useOrder();

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

  const handleViewOrdersClick = (supplier) => {
    setViewingOrdersSupplier(supplier);
  };

  const handleCloseOrdersView = () => {
    setViewingOrdersSupplier(null);
  };

  const handleNewSupplierClick = () => {
    setIsCreatingNewSupplier(true);
  };

  const handleCloseNewSupplierForm = () => {
    setIsCreatingNewSupplier(false);
  };

  const handleSaveNewSupplier = (newSupplier) => {
    const newSupplierId = Math.max(...suppliers.map((s) => s.id)) + 1;
    const supplierToAdd = {
      ...newSupplier,
      id: newSupplierId,
    };
    setSuppliers((prevSuppliers) => [...prevSuppliers, supplierToAdd]);
    setIsCreatingNewSupplier(false);
  };

  const handleDeleteSupplier = (supplierId) => {
    const supplierToDelete = suppliers.find((s) => s.id === supplierId);
    setSuppliers((prevSuppliers) =>
      prevSuppliers.filter((s) => s.id !== supplierId)
    );
    setEditingSupplier(null);
    setDeletedSupplierName(suppliertoDelete.name);
  };

  const handleCloseDeletedMessage = () => {
    setDeletedSupplierName(null);
  };

  return (
    <div className={styles.supplierContainer}>
      <SearchSuppliers />
      <CurrentSupplier
        suppliers={suppliers}
        onEditClick={handleEditClick}
        onViewOrdersClick={handleViewOrdersClick}
      />
      <NewSupplierButton onClick={handleNewSupplierClick} />
      {editingSupplier && (
        <EditSupplierForm
          supplier={editingSupplier}
          onClose={handleCloseEdit}
          onSave={handleSaveEdit}
          onDelete={handleDeleteSupplier}
        />
      )}
      {viewingOrdersSupplier && (
        <SupplierOrdersView
          supplier={viewingOrdersSupplier}
          orders={currentOrders}
          onClose={handleCloseOrdersView}
        />
      )}
      {isCreatingNewSupplier && (
        <NewSupplierForm
          onClose={handleCloseNewSupplierForm}
          onSave={handleSaveNewSupplier}
        />
      )}
      {deletedSupplierName && (
        <div className={styles.deletedMessageOverlay}>
          <div className={styles.deletedMessageBox}>
            <p>{deletedSupplierName} has been deleted.</p>
            <button
              onClick={handleCloseDeletedMessage}
              className={styles.closeButton}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CurrentSupplier({ suppliers, onEditClick, onViewOrdersClick }) {
  return (
    <div className={styles.currentSupplierContainer}>
      <h2>Current Suppliers</h2>
      <ul className={styles.currentSupplierList}>
        {suppliers.map((supplier) => (
          <li key={supplier.id} className={styles.currentSupplierItem}>
            <span>{supplier.name}</span>
            <button
              className={styles.ordersButton}
              onClick={() => onViewOrdersClick(supplier)}
            >
              View Orders
            </button>
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

function NewSupplierButton({ onClick }) {
  return (
    <button className={styles.newSupplierButton} onClick={onClick}>
      Create a new supplier
    </button>
  );
}

export default Suppliers;
