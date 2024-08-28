import React from "react";
import styles from "./styles/StockItemSupplierDetailsPopup.module.css";

function StockItemSupplierDetailsPopup({ supplier, onClose }) {
  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <h3>{supplier.name}</h3>
        <p>
          <strong>Price:</strong> £{supplier.price.toFixed(2)}
        </p>
        <p>
          <strong>Lead Time:</strong> {supplier.leadTime} days
        </p>
        <button onClick={onClose} className={styles.closeButton}>
          Close
        </button>
      </div>
    </div>
  );
}

export default StockItemSupplierDetailsPopup;
