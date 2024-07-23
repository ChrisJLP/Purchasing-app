import styles from "./styles/Orders.module.css";

function Orders() {
  return (
    <>
      <div className={styles.ordersContainer}>
        <StockNeeded />
        <RecentOrders />
        <NewOrderButton />
      </div>
    </>
  );
}

function StockNeeded() {
  return (
    <div className={styles.stockNeededContainer}>
      <h2>Stock Needed</h2>
      <ul className={styles.stockNeededList}>
        <li className={styles.stockItem}>
          <span className={styles.stockNeededItem}>5x Asus Laptops</span>
          <button className={styles.button}>Order</button>
        </li>
        <li className={styles.stockItem}>
          <span>2x Monitors</span>
          <button className={styles.button}>Order</button>
        </li>
        <li className={styles.stockItem}>
          <span>3x Lenovo Laptops</span>
          <button className={styles.button}>Order</button>
        </li>
        <li className={styles.stockItem}>
          <span>10x Keyboards</span>
          <button className={styles.button}>Order</button>
        </li>
      </ul>
    </div>
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
