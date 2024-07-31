import styles from "./styles/Orders.module.css";
import StockNeeded from "./StockNeeded";
import { useInventory } from "./InventoryContext";

function Orders() {
  const { inventoryItems } = useInventory();

  const stockNeededItems = inventoryItems
    .filter((item) => item.stock < item.minStock)
    .map((item) => ({
      name: item.name,
      quantity: item.minStock - item.stock,
    }));
  return (
    <>
      <div className={styles.ordersContainer}>
        <StockNeeded stockNeededItems={stockNeededItems} />
        <RecentOrders />
        <NewOrderButton />
      </div>
    </>
  );
}

function RecentOrders() {
  return (
    <>
      <div className={styles.recentOrdersContainer}>
        <h2>Recent Orders</h2>
        <ul className={styles.recentOrdersList}>
          <li>2x Monitors - Due 05/08</li>
          <li>3x Docks - Due 22/07</li>
          <li>3x Docks - Due 22/07</li>
          <li>3x Docks - Due 22/07</li>
        </ul>
      </div>
    </>
  );
}

function NewOrderButton() {
  return <button className={styles.newOrderButton}>Place a new order</button>;
}

export default Orders;
