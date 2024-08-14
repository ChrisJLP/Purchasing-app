import React from "react";
import styles from "./styles/OrderDetailsPopup.module.css";

function OrderDetailsPopup({ order, onClose }) {
  return (
    <div className={styles.orderDetailsContainer}>
      <h2>Order Details</h2>
      <p>
        <strong>Supplier:</strong> {order.supplier.name}
      </p>
      <p>
        <strong>Order Date:</strong> {new Date(order.date).toLocaleDateString()}
      </p>
      <p>
        <strong>Delivery Date:</strong> {order.deliveryDate}
      </p>
      <h3>Items:</h3>
      <ul>
        {order.lines.map((line, index) => (
          <li key={index}>
            {line.quantity}x {line.itemName} - £{line.price} each
          </li>
        ))}
      </ul>
      <button onClick={onClose} className={styles.closeButton}>
        Close
      </button>
    </div>
  );
}

export default OrderDetailsPopup;
