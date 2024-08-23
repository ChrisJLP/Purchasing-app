import React from "react";
import styles from "./styles/SupplierDetailsPopup.module.css";

function SupplierDetailsPopup({ supplier, onClose, onEdit, onViewOrders }) {
  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <h2>{supplier.name}</h2>
        <p>
          <strong>Contact:</strong> {supplier.contact}
        </p>
        <p>
          <strong>Email:</strong> {supplier.email}
        </p>
        <p>
          <strong>Mobile:</strong> {supplier.mobile}
        </p>
        <div className={styles.buttonContainer}>
          <button
            onClick={() => onEdit(supplier)}
            className={styles.editButton}
          >
            Edit Supplier
          </button>
          <button
            onClick={() => onViewOrders(supplier)}
            className={styles.viewOrdersButton}
          >
            View Orders
          </button>
        </div>
        <button onClick={onClose} className={styles.closeButton}>
          Close
        </button>
      </div>
    </div>
  );
}

export default SupplierDetailsPopup;
