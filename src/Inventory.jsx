import styles from "./styles/Inventory.module.css";
import { inventoryItems } from "./data/inventoryData";
import { StockNeeded } from "./Dashboard";

function Inventory() {
  return (
    <div className={styles.inventoryContainer}>
      <CurrentStock />
      <StockNeeded />
    </div>
  );
}

function CurrentStock() {
  return (
    <div className={styles.currentStockContainer}>
      <h2>Current Stock</h2>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Stock</th>
            <th>Min Stock</th>
          </tr>
        </thead>
        <tbody>
          {inventoryItems.map((item, index) => (
            <tr key={index} className={styles.tableRow}>
              <td>{item.name}</td>
              <td>{item.stock}</td>
              <td>{item.minStock}</td>
              <td>
                <button className={styles.editButton}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Inventory;
