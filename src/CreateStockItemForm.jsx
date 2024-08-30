import React, { useState } from "react";
import { useSupplier } from "./SupplierContext";
import styles from "./styles/CreateStockItemForm.module.css";
import AddSupplierForm from "./AddSupplierForm";
import StockItemSupplierDetailsPopup from "./StockItemSupplierDetailsPopup";

function CreateStockItemForm({ onClose, onCreateItem }) {
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [minStock, setMinStock] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [errors, setErrors] = useState({});
  const [showAddSupplierForm, setShowAddSupplierForm] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const newItem = {
        name,
        stock: parseInt(stock),
        onOrder: 0,
        minStock: parseInt(minStock),
        suppliers: suppliers.length > 0 ? suppliers : [], // Ensure suppliers is always an array
      };
      onCreateItem(newItem);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!stock || isNaN(stock) || parseInt(stock) < 0)
      newErrors.stock = "Initial stock must be a non-negative number";
    if (!minStock || isNaN(minStock) || parseInt(minStock) < 0)
      newErrors.minStock = "Minimum stock must be a non-negative number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSupplier = (newSupplier) => {
    const formattedSupplier = {
      name: newSupplier.name,
      price: parseFloat(newSupplier.price),
      leadTime: parseInt(newSupplier.leadTime),
    };
    setSuppliers([...suppliers, formattedSupplier]);
    setShowAddSupplierForm(false);
  };

  const handleSupplierClick = (supplier) => {
    setSelectedSupplier(supplier);
  };

  return (
    <div className={styles.formOverlay}>
      <div className={styles.formContainer}>
        <h2>Create New Stock Item</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && (
              <div className={styles.errorMessage}>{errors.name}</div>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="stock">Initial Stock:</label>
            <input
              type="number"
              id="stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
            {errors.stock && (
              <div className={styles.errorMessage}>{errors.stock}</div>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="minStock">Minimum Stock:</label>
            <input
              type="number"
              id="minStock"
              value={minStock}
              onChange={(e) => setMinStock(e.target.value)}
            />
            {errors.minStock && (
              <div className={styles.errorMessage}>{errors.minStock}</div>
            )}
          </div>
          <div className={styles.supplierSection}>
            <h3>Suppliers</h3>
            {suppliers.map((supplier, index) => (
              <div key={index} className={styles.supplierLink}>
                <span onClick={() => handleSupplierClick(supplier)}>
                  {supplier.name}
                </span>
              </div>
            ))}
            <button
              type="button"
              className={styles.button}
              onClick={() => setShowAddSupplierForm(true)}
            >
              Add Supplier
            </button>
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.button}>
              Create Item
            </button>
            <button type="button" className={styles.button} onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
      {showAddSupplierForm && (
        <AddSupplierForm
          onAddSupplier={handleAddSupplier}
          onClose={() => setShowAddSupplierForm(false)}
        />
      )}
      {selectedSupplier && (
        <StockItemSupplierDetailsPopup
          supplier={selectedSupplier}
          onClose={() => setSelectedSupplier(null)}
        />
      )}
    </div>
  );
}

export default CreateStockItemForm;
