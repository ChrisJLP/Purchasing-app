// import { useState } from "react";
// import styles from "./styles/Inventory.module.css";
// import { inventoryItems as initialInventoryItems } from "./data/inventoryData";
// import { StockNeeded } from "./Dashboard";

// function Inventory() {
//   const [inventoryItems, setInventoryItems] = useState(initialInventoryItems);
//   return (
//     <div className={styles.inventoryContainer}>
//       <CurrentStock
//         inventoryItems={inventoryItems}
//         setInventoryItems={setInventoryItems}
//       />
//       <StockNeeded />
//     </div>
//   );
// }

// function CurrentStock({ inventoryItems, setInventoryItems }) {
//   const handleEdit = (index) => {
//     const updatedItems = [...inventoryItems];
//     updatedItems[index] = {
//       ...updatedItems[index],
//       minStock: 6,
//     };
//     setInventoryItems(updatedItems);
//     console.log("Edit items:", inventoryItems[index]);
//   };
//   return (
//     <div className={styles.currentStockContainer}>
//       <h2>Current Stock</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>Item</th>
//             <th>Stock</th>
//             <th>Min Stock</th>
//           </tr>
//         </thead>
//         <tbody>
//           {inventoryItems.map((item, index) => (
//             <tr key={index} className={styles.tableRow}>
//               <td>{item.name}</td>
//               <td>{item.stock}</td>
//               <td>{item.minStock}</td>
//               <td>
//                 <button
//                   className={styles.editButton}
//                   onClick={() => handleEdit(index)}
//                 >
//                   Edit
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default Inventory;

import { useState } from "react";
import styles from "./styles/Inventory.module.css";
import { inventoryItems as initialInventoryItems } from "./data/inventoryData";
import { StockNeeded } from "./Dashboard";

function Inventory() {
  const [inventoryItems, setInventoryItems] = useState(initialInventoryItems);
  return (
    <div className={styles.inventoryContainer}>
      <CurrentStock
        inventoryItems={inventoryItems}
        setInventoryItems={setInventoryItems}
      />
      <StockNeeded />
    </div>
  );
}

function CurrentStock({ inventoryItems, setInventoryItems }) {
  const [editIndex, setEditIndex] = useState(null);
  const [editedStock, setEditedStock] = useState("");
  const [editedMinStock, setEditedMinStock] = useState("");

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedStock(inventoryItems[index].stock);
    setEditedMinStock(inventoryItems[index].minStock);
  };

  const handleSave = (index) => {
    const updatedItems = [...inventoryItems];
    updatedItems[index] = {
      ...updatedItems[index],
      stock: editedStock,
      minStock: editedMinStock,
    };
    setInventoryItems(updatedItems);
    setEditIndex(null);
  };

  return (
    <div className={styles.currentStockContainer}>
      <h2>Current Stock</h2>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Stock</th>
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
                    onChange={(e) => setEditedStock(e.target.value)}
                  />
                ) : (
                  item.stock
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <input
                    type="number"
                    value={editedMinStock}
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
