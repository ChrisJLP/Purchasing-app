import React, { useState } from "react";
import { useSupplier } from "./SupplierContext";
import styles from "./styles/AddSupplierForm.module.css";

function AddSupplierForm({ onAddSupplier, onClose }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [leadTime, setLeadTime] = useState("");
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const { getActiveSuppliers } = useSupplier();

  const handleSupplierSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setName(value);

    if (value.length >= 2) {
      const suggestionResults = getActiveSuppliers().filter((supplier) =>
        supplier.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(suggestionResults);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (supplier) => {
    setName(supplier.name);
    setSearchTerm("");
    setSuggestions([]);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Supplier name is required";
    if (!price || isNaN(price) || parseFloat(price) <= 0)
      newErrors.price = "Price must be a positive number";
    if (!leadTime || isNaN(leadTime) || parseInt(leadTime) <= 0)
      newErrors.leadTime = "Lead time must be a positive number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onAddSupplier({
        name,
        price: parseFloat(price),
        leadTime: parseInt(leadTime),
      });
    }
  };

  return (
    <div className={styles.formOverlay}>
      <div className={styles.formContainer}>
        <h3>Add Supplier</h3>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="supplierName">Supplier Name:</label>
            <div className={styles.searchInputContainer}>
              <input
                type="text"
                id="supplierName"
                value={name}
                onChange={handleSupplierSearchChange}
              />
              {suggestions.length > 0 && (
                <ul className={styles.suggestions}>
                  {suggestions.map((sugg) => (
                    <li
                      key={sugg.id}
                      onClick={() => handleSuggestionClick(sugg)}
                    >
                      {sugg.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {errors.name && (
              <div className={styles.errorMessage}>{errors.name}</div>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="price">Price:</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            {errors.price && (
              <div className={styles.errorMessage}>{errors.price}</div>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="leadTime">Lead Time (days):</label>
            <input
              type="number"
              id="leadTime"
              value={leadTime}
              onChange={(e) => setLeadTime(e.target.value)}
            />
            {errors.leadTime && (
              <div className={styles.errorMessage}>{errors.leadTime}</div>
            )}
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.button}>
              Add Supplier
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

export default AddSupplierForm;
