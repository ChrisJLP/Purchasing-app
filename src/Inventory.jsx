import styles from "./styles/Inventory.module.css";

function Inventory() {
  return (
    <div className={styles.inventoryContainer}>
      <CurrentStock />
    </div>
  );
}

function CurrentStock() {
  const items = [
    { name: "Laptop", stock: 5 },
    { name: "Monitor", stock: 9 },
    { name: "Dock", stock: 4 },
    { name: "Keyboard", stock: 14 },
  ];
  return (
    <div className={styles.currentStockContainer}>
      <h2>Current Stock</h2>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Stock</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className={styles.tableRow}>
              <td>{item.name}</td>
              <td>{item.stock}</td>
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
