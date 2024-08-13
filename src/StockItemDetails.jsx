import React from "react";
import styles from "./styles/StockItemDetails.module.css";

function StockItemDetails({ item, onClose }) {
  return (
    <div className={styles.stockItemDetailsContainer}>
      <h2>Stock Item</h2>
      <p>
        <strong>Description:</strong> {item.name}
      </p>
      <p>
        <strong>Suppliers:</strong>
        {item.suppliers.map((supplier) => supplier.name).join(", ")}
      </p>
      <p>
        <strong>Item code:</strong>
        {item.id}
      </p>
      <p>
        <strong>Quantity needed:</strong>
        {item.stockNeeded}
      </p>
      <button onClick={onClose} className={styles.closeButton}>
        Close
      </button>
    </div>
  );
}

export default StockItemDetails;
