import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import styles from "./styles/Suppliers.module.css";
import EditSupplierForm from "./editSupplierForm";
import SupplierOrdersView from "./SuppliersOrdersView";
import NewSupplierForm from "./NewSupplierForm";
import SupplierDetailsPopup from "./SupplierDetailsPopup";
import { useOrder } from "./OrderContext";
import { useSupplier } from "./SupplierContext";

function Suppliers() {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } =
    useSupplier();
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [viewingOrdersSupplier, setViewingOrdersSupplier] = useState(null);
  const [isCreatingNewSupplier, setIsCreatingNewSupplier] = useState(false);
  const [deletedSupplierName, setDeletedSupplierName] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const { currentOrders } = useOrder();
  const location = useLocation();
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (location.state?.focusSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    if (location.state?.openCreateForm) {
      setIsCreatingNewSupplier(true);
    }
  }, [location]);

  const handleEditClick = (supplier) => {
    setEditingSupplier(supplier);
  };

  const handleCloseEdit = () => {
    setEditingSupplier(null);
  };

  const handleSaveEdit = (editedSupplier) => {
    updateSupplier(editedSupplier);
    setEditingSupplier(null);
    setSelectedSupplier(editedSupplier);
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

  const handleSupplierClick = (supplier) => {
    setSelectedSupplier(supplier);
  };

  const handleClosePopup = () => {
    setSelectedSupplier(null);
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
      <SearchSuppliers
        onSupplierClick={handleSupplierClick}
        ref={searchInputRef}
      />
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
      {selectedSupplier && (
        <SupplierDetailsPopup
          supplier={selectedSupplier}
          onClose={handleClosePopup}
          onEdit={handleEditClick}
          onViewOrders={handleViewOrdersClick}
        />
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

const SearchSuppliers = React.forwardRef(({ onSupplierClick }, ref) => {
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

  const handleSuggestionClick = (supplier) => {
    setSearchTerm(supplier.name);
    setSuggestions([]);
    onSupplierClick(supplier);
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
            ref={ref}
          />
          {suggestions.length > 0 && (
            <ul className={styles.suggestions}>
              {suggestions.map((supplier) => (
                <li
                  key={supplier.id}
                  onClick={() => handleSuggestionClick(supplier)}
                >
                  {supplier.name}
                </li>
              ))}
            </ul>
          )}
          {searchResults.length > 0 && (
            <ul className={styles.searchResults}>
              {searchResults.map((supplier) => (
                <li key={supplier.id} onClick={() => onSupplierClick(supplier)}>
                  {supplier.name}
                </li>
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
});

function NewSupplierButton({ onClick }) {
  return (
    <button className={styles.newSupplierButton} onClick={onClick}>
      Create a new supplier
    </button>
  );
}

export default Suppliers;
