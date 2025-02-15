import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import styles from "./styles/Dashboard.module.css";
import StockItemDetails from "./StockItemDetails";

const StockNeeded = React.memo(function StockNeeded({
  stockNeededItems = [],
  inventoryItems,
  isClickable = false,
  showOrderButton = true,
  isOrdersPage = false,
  onQuickOrder,
}) {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (item) => {
    if (isClickable) {
      const fullItemDetails = inventoryItems.find(
        (invItem) => invItem.id === item.id
      );
      setSelectedItem(fullItemDetails);
    }
  };

  const handleCloseDetails = () => {
    setSelectedItem(null);
  };

  const groupedItems = useMemo(() => {
    if (!isOrdersPage) return null;

    const grouped = {};
    stockNeededItems.forEach((item) => {
      const fullItem = inventoryItems.find((invItem) => invItem.id === item.id);
      if (fullItem && fullItem.suppliers && fullItem.suppliers.length > 0) {
        const cheapestSupplier = fullItem.suppliers.reduce((min, supplier) =>
          parseFloat(supplier.price) < parseFloat(min.price) ? supplier : min
        );

        if (!grouped[cheapestSupplier.name]) {
          grouped[cheapestSupplier.name] = [];
        }
        grouped[cheapestSupplier.name].push({
          ...item,
          supplierId: cheapestSupplier.id,
        });
      } else {
        // Handle items without suppliers or with an empty suppliers array
        if (!grouped["No Supplier"]) {
          grouped["No Supplier"] = [];
        }
        grouped["No Supplier"].push({ ...item, supplierId: null });
      }
    });
    return grouped;
  }, [stockNeededItems, inventoryItems, isOrdersPage]);

  return (
    <div className={styles.stockNeededContainer}>
      <h2>Stock needed</h2>
      {stockNeededItems.length === 0 ? (
        <p className={styles.noStockNeeded}>
          All minimum stock levels are currently met
        </p>
      ) : isOrdersPage ? (
        Object.entries(groupedItems).map(([supplierName, items]) => (
          <div key={supplierName} className={styles.stockNeededSupplier}>
            <h3>{supplierName}</h3>
            <ul className={styles.list}>
              {items.map((item) => (
                <li key={item.id} className={styles.stockItem}>
                  <p
                    onClick={() => handleItemClick(item)}
                    className={styles.stockItemButton}
                  >
                    {item.quantity}x {item.name}
                  </p>
                </li>
              ))}
            </ul>
            <button
              onClick={() => onQuickOrder(supplierName, items)}
              className={styles.quickOrderButton}
            >
              Quick Order
            </button>
          </div>
        ))
      ) : (
        <ul className={styles.list}>
          {stockNeededItems.map((item) => (
            <li key={item.id} className={styles.stockItem}>
              {isClickable ? (
                <button
                  onClick={() => handleItemClick(item)}
                  className={styles.stockItemButton}
                >
                  {item.quantity}x {item.name}
                </button>
              ) : (
                <span className={styles.stockItemsText}>
                  {item.quantity}x {item.name}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
      {showOrderButton && !isOrdersPage && (
        <button className={styles.button}>
          <Link to="/orders" className={styles.navLink}>
            Go to orders
          </Link>
        </button>
      )}
      {selectedItem && isClickable && (
        <StockItemDetails item={selectedItem} onClose={handleCloseDetails} />
      )}
    </div>
  );
});

export default StockNeeded;
