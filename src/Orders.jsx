import React, { useState } from "react";
import styles from "./styles/Orders.module.css";
import StockNeeded from "./StockNeeded";
import { useInventory } from "./InventoryContext";

function Orders() {
  const { inventoryItems } = useInventory();
  const [showForm, setShowForm] = useState(false);

  const stockNeededItems = inventoryItems
    .filter((item) => item.stock < item.minStock)
    .map((item) => ({
      name: item.name,
      quantity: item.minStock - item.stock,
    }));

  const handleNewOrderClick = () => {
    setShowForm(!showForm);
  };
  return (
    <>
      <div className={styles.ordersContainer}>
        <StockNeeded stockNeededItems={stockNeededItems} />
        <RecentOrders />
        <NewOrderButton onClick={handleNewOrderClick} />
        {showForm && <OrderForm />}
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

function NewOrderButton({ onClick }) {
  return (
    <button className={styles.newOrderButton} onClick={onClick}>
      Place a new order
    </button>
  );
}

function OrderForm() {
  return (
    <div className={styles.formContainer}>
      <form>
        <fieldset>
          <legend>New Order</legend>
        </fieldset>
      </form>
    </div>
  );
}

export default Orders;
