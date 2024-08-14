import React from "react";
import styles from "./styles/StockItemDetails.module.css";

function StockItemDetails({ item, onClose }) {
  return (
    <div className={styles.stockItemDetailsContainer}>
      <p>
        <strong>Description:</strong> {item.name}
      </p>

      <ul className={styles.suppliersList}>
        {item.suppliers.map((supplier) => (
          <li key={supplier.id} className={styles.supplierItem}>
            {supplier.name}: £{supplier.price}
          </li>
        ))}
      </ul>
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
