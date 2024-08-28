import React, { useState } from "react";
import { useSupplier } from "./SupplierContext";
import styles from "./styles/CreateStockItemForm.module.css";

function CreateStockItemForm({ onClose, onCreateItem }) {
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [minStock, setMinStock] = useState("");
  const [suppliers, setSuppliers] = useState([
    { name: "", price: "", leadTime: "" },
  ]);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const { getActiveSuppliers } = useSupplier();

  const handleSupplierSearchChange = (e, index) => {
    const value = e.target.value;
    setSearchTerm(value);
    updateSupplier(index, "name", value);

    if (value.length >= 2) {
      const suggestionResults = getActiveSuppliers().filter((supplier) =>
        supplier.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(suggestionResults);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (supplier, index) => {
    updateSupplier(index, "name", supplier.name);
    setSearchTerm("");
    setSuggestions([]);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!stock || isNaN(stock) || parseInt(stock) < 0) {
      newErrors.stock = "Initial stock must be a non-negative number";
    }

    if (!minStock || isNaN(minStock) || parseInt(minStock) < 0) {
      newErrors.minStock = "Minimum stock must be a non-negative number";
    }

    suppliers.forEach((supplier, index) => {
      if (
        supplier.name &&
        (!supplier.price ||
          isNaN(supplier.price) ||
          parseFloat(supplier.price) <= 0)
      ) {
        newErrors[`supplierPrice${index}`] = "Price must be a positive number";
      }
      if (
        supplier.name &&
        (!supplier.leadTime ||
          isNaN(supplier.leadTime) ||
          parseInt(supplier.leadTime) <= 0)
      ) {
        newErrors[`supplierLeadTime${index}`] =
          "Lead time must be a positive number";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const newItem = {
        id: Date.now(),
        name,
        stock: parseInt(stock),
        onOrder: 0,
        minStock: parseInt(minStock),
        suppliers: suppliers
          .filter(
            (supplier) => supplier.name && supplier.price && supplier.leadTime
          )
          .map((supplier, index) => ({
            id: index + 1,
            name: supplier.name,
            price: supplier.price,
            leadTime: parseInt(supplier.leadTime),
          })),
      };
      onCreateItem(newItem);
    }
  };

  const addSupplier = () => {
    if (suppliers.length < 1) {
      setSuppliers([...suppliers, { name: "", price: "", leadTime: "" }]);
    }
  };

  const updateSupplier = (index, field, value) => {
    const updatedSuppliers = suppliers.map((supplier, i) => {
      if (i === index) {
        return { ...supplier, [field]: value };
      }
      return supplier;
    });
    setSuppliers(updatedSuppliers);
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
              <div key={index} className={styles.supplierGroup}>
                <div className={styles.searchInputContainer}>
                  <input
                    type="text"
                    placeholder="Supplier Name"
                    value={supplier.name}
                    onChange={(e) => handleSupplierSearchChange(e, index)}
                  />
                  {suggestions.length > 0 && (
                    <ul className={styles.suggestions}>
                      {suggestions.map((sugg) => (
                        <li
                          key={sugg.id}
                          onClick={() => handleSuggestionClick(sugg, index)}
                        >
                          {sugg.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <input
                  type="number"
                  placeholder="Price"
                  value={supplier.price}
                  onChange={(e) =>
                    updateSupplier(index, "price", e.target.value)
                  }
                />
                <input
                  type="number"
                  placeholder="Lead Time (days)"
                  value={supplier.leadTime}
                  onChange={(e) =>
                    updateSupplier(index, "leadTime", e.target.value)
                  }
                />
              </div>
            ))}
            {suppliers.length < 1 && (
              <button
                type="button"
                onClick={addSupplier}
                className={styles.button}
              >
                Add Supplier
              </button>
            )}
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
    </div>
  );
}

export default CreateStockItemForm;
