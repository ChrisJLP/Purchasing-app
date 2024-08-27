import React from "react";
import styles from "./styles/OrderDetailsPopup.module.css";

function OrderDetailsPopup({ order, onClose, highlightedItemId }) {
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div className={styles.orderDetailsContainer}>
      <h2>Purchase order {order.orderNumber}</h2>
      <p>
        <strong>Supplier:</strong> {order.supplier.name}
      </p>
      <p>
        <strong>Order Date:</strong> {new Date(order.date).toLocaleDateString()}
      </p>
      <p>
        <strong>Delivery Date:</strong> {formatDate(order.deliveryDate)}
      </p>
      <h3>Items:</h3>
      <ul>
        {order.lines.map((line, index) => (
          <li
            key={index}
            className={
              parseInt(line.itemId) === highlightedItemId
                ? styles.highlightedItem
                : ""
            }
          >
            {line.quantity}x {line.itemName} - £{line.price}
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
