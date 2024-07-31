import React from "react";
import { Link } from "react-router-dom";
import styles from "./styles/Dashboard.module.css";

function StockNeeded({ stockNeededItems = [] }) {
  return (
    <div className={styles.stockNeededContainer}>
      <h2>Stock needed</h2>
      {stockNeededItems.length === 0 ? (
        <p className={styles.noStockNeeded}>
          All minimum stock levels are currently met
        </p>
      ) : (
        <ul className={styles.list}>
          {stockNeededItems.map((item, index) => (
            <li key={index} className={styles.listItem}>
              {item.quantity}x {item.name}
            </li>
          ))}
        </ul>
      )}
      <button className={styles.button}>
        <Link to="/orders" className={styles.navLink}>
          Go to orders
        </Link>
      </button>
    </div>
  );
}

export default StockNeeded;
