import { Link } from "react-router-dom";
import styles from "./styles/Dashboard.module.css";
import StockNeeded from "./StockNeeded";
import { useInventory } from "./InventoryContext";

function Dashboard() {
  const { stockNeededItems, inventoryItems, isInitialized } = useInventory();

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
      <SupplierOrders />
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

function SupplierOrders() {
  return (
    <div className={styles.supplierOrderContainer}>
      <h2>Current Supplier Orders</h2>
      {/* //Make this use data from Orders.jsx */}
      <ul>
        <li className={styles.item}>2x Monitors - due 05/08</li>
        <li className={styles.item}>3x Docks - due 22/07</li>
        <li className={styles.item}>3x Docks - due 22/07</li>
        <li className={styles.item}>3x Docks - due 22/07</li>
      </ul>
    </div>
  );
}

function QuickLinks() {
  return (
    <div className={styles.quickLinksContainer}>
      <h2>Quick Links</h2>
      <ul className={styles.quickLinksList}>
        <li className={styles.quickLink}>Create Order</li>
        <li className={styles.quickLink}>Search Item</li>
        <li className={styles.quickLink}>Search Supplier</li>
        <li className={styles.quickLink}>Create Item</li>
        <li className={styles.quickLink}>Create Supplier</li>
      </ul>
    </div>
  );
}

export { Dashboard, StockNeeded };
