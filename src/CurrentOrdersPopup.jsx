import React from "react";
import styles from "./styles/CurrentOrdersPopup.module.css";

function CurrentOrdersPopup({ orders, itemName, onClose, onViewOrderDetails }) {
  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <h2>Current Orders for {itemName}</h2>
        {orders.length === 0 ? (
          <p>No current orders for this item.</p>
        ) : (
          <ul className={styles.orderList}>
            {orders.map((order) => (
              <li key={order.orderNumber} className={styles.orderItem}>
                <span>Order Number: {order.orderNumber}</span>
                <button
                  onClick={() => onViewOrderDetails(order)}
                  className={styles.viewDetailsButton}
                >
                  View Details
                </button>
              </li>
            ))}
          </ul>
        )}
        <button onClick={onClose} className={styles.closeButton}>
          Close
        </button>
      </div>
    </div>
  );
}

export default CurrentOrdersPopup;
