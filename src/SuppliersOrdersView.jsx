import React from "react";
import styles from "./styles/SupplierOrdersView.module.css";

function SupplierOrdersView({ supplier, orders, onClose }) {
  const supplierOrders = orders.filter(
    (order) => order.supplier.id === supplier.id
  );

  return (
    <div className={styles.formOverlay}>
      <div className={styles.formContainer}>
        <h2>{supplier.name} Orders</h2>
        {supplierOrders.length === 0 ? (
          <p>No orders found for this supplier.</p>
        ) : (
          <ul className={styles.orderList}>
            {supplierOrders.map((order) => (
              <li key={order.orderNumber} className={styles.orderItem}>
                <p>Order Number: {order.orderNumber}</p>
                <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                <p>Delivery Date: {order.deliveryDate}</p>
                <ul className={styles.orderLines}>
                  {order.lines.map((line, index) => (
                    <li key={index}>
                      {line.quantity}x {line.itemName} - £{line.price}
                    </li>
                  ))}
                </ul>
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

export default SupplierOrdersView;
