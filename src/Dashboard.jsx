import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles/Dashboard.module.css";
import StockNeeded from "./StockNeeded";
import { useInventory } from "./InventoryContext";
import { useOrder } from "./OrderContext";

function Dashboard() {
  const { stockNeededItems, inventoryItems, isInitialized } = useInventory();
  const { currentOrders } = useOrder();

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <StockNeeded
        stockNeededItems={stockNeededItems}
        inventoryItems={inventoryItems}
        isClickable={false}
        showOrderButton={true}
      />
      <CustomerOrders />
      <SupplierOrders currentOrders={currentOrders} />
      <QuickLinks />
    </div>
  );
}

function CustomerOrders() {
  return (
    <div className={styles.customerOrderContainer}>
      <h2>Recent Customer Orders</h2>
      <ul className={styles.list}>
        <li className={styles.listItem}>2x Keyboards</li>
        <li className={styles.listItem}>1x Monitor</li>
        <li className={styles.listItem}>3x Asus Laptops</li>
        <li className={styles.listItem}>3x Asus Laptops</li>
      </ul>
    </div>
  );
}

function SupplierOrders({ currentOrders }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}`;
  };
  return (
    <div className={styles.supplierOrderContainer}>
      <h2>Current Supplier Orders</h2>
      <ul>
        {currentOrders.slice(0, 4).map((order, index) => (
          <li key={index} className={styles.item}>
            {order.lines.map((line, lineIndex) => (
              <span key={lineIndex}>
                {line.quantity}x {line.itemName}
              </span>
            ))}
            {" - due "}
            {formatDate(order.deliveryDate)}
          </li>
        ))}
      </ul>
    </div>
  );
}

function QuickLinks() {
  const navigate = useNavigate();

  const handleCreateItem = () => {
    navigate("/inventory", { state: { openCreateForm: true } });
  };

  const handleCreateSupplier = () => {
    navigate("/suppliers", { state: { openCreateForm: true } });
  };

  return (
    <div className={styles.quickLinksContainer}>
      <h2>Quick Links</h2>
      <ul className={styles.quickLinksList}>
        <li className={styles.quickLink}>
          <Link to="/orders" state={{ openOrderForm: true }}>
            Create Order
          </Link>
        </li>
        <li className={styles.quickLink}>
          <Link to="/suppliers" state={{ focusSearch: true }}>
            Search Supplier
          </Link>
        </li>
        <li className={styles.quickLink} onClick={handleCreateItem}>
          Create Item
        </li>
        <li className={styles.quickLink} onClick={handleCreateSupplier}>
          Create Supplier
        </li>
      </ul>
    </div>
  );
}

export { Dashboard, StockNeeded };
