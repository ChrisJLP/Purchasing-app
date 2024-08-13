import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./styles/Dashboard.module.css";
import StockItemDetails from "./StockItemDetails";

function StockNeeded({ stockNeededItems = [], inventoryItems }) {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (item) => {
    const fullItemDetails = inventoryItems.find(
      (invItem) => invItem.id === item.id
    );
    setSelectedItem(fullItemDetails);
  };

  const handleCloseDetails = () => {
    setSelectedItem(null);
  };

  return (
    <div className={styles.stockNeededContainer}>
      <h2>Stock needed</h2>
      {stockNeededItems.length === 0 ? (
        <p className={styles.noStockNeeded}>
          All minimum stock levels are currently met
        </p>
      ) : (
        <ul className={styles.list}>
          {stockNeededItems.map((item) => (
            <li key={item.id} className={styles.stockItem}>
              <button
                onClick={() => handleItemClick(item)}
                className={styles.stockItemButton}
              >
                {item.quantity}x {item.name}
              </button>
            </li>
          ))}
        </ul>
      )}
      <button className={styles.button}>
        <Link to="/orders" className={styles.navLink}>
          Go to orders
        </Link>
      </button>
      {selectedItem && (
        <StockItemDetails item={selectedItem} onClose={handleCloseDetails} />
      )}
    </div>
  );
}

export default StockNeeded;
