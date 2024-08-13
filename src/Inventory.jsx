import React, { useState } from "react";
import styles from "./styles/Inventory.module.css";
import { useInventory } from "./InventoryContext";
import StockNeeded from "./StockNeeded";

function Inventory() {
  const { inventoryItems, stockNeededItems } = useInventory();

  return (
    <div className={styles.inventoryContainer}>
      <CurrentStock inventoryItems={inventoryItems} />
      <StockNeeded stockNeededItems={stockNeededItems} />
    </div>
  );
}

function CurrentStock({ inventoryItems }) {
  const [editIndex, setEditIndex] = useState(null);
  const [editedStock, setEditedStock] = useState("");
  const [editedMinStock, setEditedMinStock] = useState("");
  const { updateStockLevel } = useInventory();

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedStock(inventoryItems[index].stock);
    setEditedMinStock(inventoryItems[index].minStock);
  };

  const handleSave = (index) => {
    updateStockLevel(index, editedStock, editedMinStock);
    setEditIndex(null);
  };

  return (
    <div className={styles.currentStockContainer}>
      <h2>Current Stock</h2>
      <table className={styles.inventoryTable}>
        <thead>
          <tr className={styles.inventoryTr}>
            <th className={styles.inventoryTh}>Item</th>
            <th>Stock</th>
            <th>On Order</th>
            <th>Min Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventoryItems.map((item, index) => (
            <tr key={index} className={styles.tableRow}>
              <td>{item.name}</td>
              <td>
                {editIndex === index ? (
                  <input
                    type="number"
                    value={editedStock}
                    className={styles.inventoryNumInput}
                    onChange={(e) => setEditedStock(e.target.value)}
                  />
                ) : (
                  item.stock
                )}
              </td>
              <td>{item.onOrder}</td>
              <td>
                {editIndex === index ? (
                  <input
                    type="number"
                    value={editedMinStock}
                    className={styles.inventoryNumInput}
                    onChange={(e) => setEditedMinStock(e.target.value)}
                  />
                ) : (
                  item.minStock
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <button
                    className={styles.saveButton}
                    onClick={() => handleSave(index)}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className={styles.editButton}
                    onClick={() => handleEdit(index)}
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Inventory;
