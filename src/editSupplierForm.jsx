import React, { useState } from "react";
import styles from "./styles/editSupplierForm.module.css";
import { useOrder } from "./OrderContext";

function EditSupplierForm({ supplier, onClose, onSave, onDelete }) {
  const [editedSupplier, setEditedSupplier] = useState(supplier);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { hasCurrentOrders } = useOrder();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedSupplier((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedSupplier);
  };

  const handleDeleteClick = () => {
    if (hasCurrentOrders(supplier.id)) {
      setErrorMessage("Cannot delete a supplier that has open orders.");
    } else {
      setShowDeleteConfirmation(true);
    }
  };

  const handleConfirmDelete = () => {
    onDelete(supplier.id);
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
            <button
              type="button"
              onClick={handleDeleteClick}
              className={styles.deleteButton}
            >
              Delete Supplier
            </button>
          </div>
          {errorMessage && (
            <div className={styles.errorMessage}>{errorMessage}</div>
          )}
        </form>
      </div>
      {showDeleteConfirmation && (
        <div className={styles.confirmationOverlay}>
          <div className={styles.confirmationBox}>
            <p>
              Are you sure you would like to delete {supplier.name}? This is
              irreversible.
            </p>
            <div className={styles.confirmationActions}>
              <button
                onClick={handleConfirmDelete}
                className={styles.confirmDeleteButton}
              >
                Yes, delete {supplier.name}
              </button>
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditSupplierForm;
