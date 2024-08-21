import React, { useState } from "react";
import styles from "./styles/EditSupplierForm.module.css";

function EditSupplierForm({ supplier, onClose, onSave }) {
  const [editedSupplier, setEditedSupplier] = useState(supplier);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedSupplier((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedSupplier);
  };

  return (
    <div className={styles.formOverlay}>
      <div className={styles.formContainer}>
        <h2>Edit Supplier</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={editedSupplier.name}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="contact">Contact:</label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={editedSupplier.contact}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={editedSupplier.email}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="mobile">Mobile:</label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={editedSupplier.mobile}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.saveButton}>
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditSupplierForm;
