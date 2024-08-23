import React, { useState, useEffect } from "react";
import styles from "./styles/Suppliers.module.css";
import { suppliersData } from "./data/suppliersData";
import EditSupplierForm from "./editSupplierForm";
import SupplierOrdersView from "./SuppliersOrdersView";
import NewSupplierForm from "./NewSupplierForm";
import { useOrder } from "./OrderContext";
import { useSupplier } from "./SupplierContext";

function Suppliers() {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } =
    useSupplier();
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
    updateSupplier(editedSupplier);
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
    addSupplier(newSupplier);
    setIsCreatingNewSupplier(false);
  };

  const handleDeleteSupplier = (supplierId) => {
    const supplierToDelete = suppliers.find((s) => s.id === supplierId);
    deleteSupplier(supplierId);
    setEditingSupplier(null);
    setDeletedSupplierName(supplierToDelete.name);
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
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const { getActiveSuppliers } = useSupplier();

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length >= 2) {
      const suggestionResults = getActiveSuppliers().filter((supplier) =>
        supplier.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(suggestionResults);
    } else {
      setSuggestions([]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.length >= 2) {
      const results = getActiveSuppliers().filter((supplier) =>
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
      setSuggestions([]);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className={styles.searchSuppliersContainer}>
      <h2>Search Suppliers</h2>
      <form onSubmit={handleSearch} className={styles.search}>
        <div className={styles.searchInputContainer}>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search suppliers..."
          />
          {suggestions.length > 0 && (
            <ul className={styles.suggestions}>
              {suggestions.map((supplier) => (
                <li key={supplier.id}>{supplier.name}</li>
              ))}
            </ul>
          )}
        </div>
        <input type="submit" value="Search" />
      </form>
      {searchResults.length > 0 && (
        <ul className={styles.searchResults}>
          {searchResults.map((supplier) => (
            <li key={supplier.id}>{supplier.name}</li>
          ))}
        </ul>
      )}
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
