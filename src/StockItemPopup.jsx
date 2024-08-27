import React from "react";
import styles from "./styles/StockItemPopup.module.css";

function StockItemPopup({ item, onClose }) {
  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <h2>{item.name}</h2>
        <p>Stock: {item.stock}</p>
        <p>On Order: {item.onOrder}</p>
        <p>Minimum Stock: {item.minStock}</p>
        <h3>Suppliers:</h3>
        <ul>
          {item.suppliers.map((supplier, index) => (
            <li key={index}>
              {supplier.name}: £{supplier.price}
            </li>
          ))}
        </ul>
        <button onClick={onClose} className={styles.closeButton}>
          Close
        </button>
      </div>
    </div>
  );
}

export default StockItemPopup;
