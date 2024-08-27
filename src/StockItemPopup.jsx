import React from "react";
import styles from "./styles/StockItemPopup.module.css";

function StockItemPopup({ item, onClose, onViewOrders }) {
  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <h2>{item.name}</h2>
        <p>
          <strong>Stock:</strong> {item.stock}
        </p>
        <p>
          <strong>On Order:</strong> {item.onOrder}
        </p>
        <p>
          <strong>Minimum Stock:</strong> {item.minStock}
        </p>
        <h3>Suppliers:</h3>
        <table className={styles.supplierTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Lead Time (days)</th>
            </tr>
          </thead>
          <tbody>
            {item.suppliers.map((supplier, index) => (
              <tr key={index}>
                <td>{supplier.name}</td>
                <td>£{supplier.price}</td>
                <td>{supplier.leadTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={onViewOrders} className={styles.viewOrdersButton}>
          View Current Orders
        </button>
        <button onClick={onClose} className={styles.closeButton}>
          Close
        </button>
      </div>
    </div>
  );
}

export default StockItemPopup;
