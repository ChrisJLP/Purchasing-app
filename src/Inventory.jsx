import React, { useState } from "react";
import styles from "./styles/Inventory.module.css";
import { useInventory } from "./InventoryContext";
import { useOrder } from "./OrderContext";
import StockNeeded from "./StockNeeded";
import StockItemPopup from "./StockItemPopup";
import CurrentOrdersPopup from "./CurrentOrdersPopup";
import OrderDetailsPopup from "./OrderDetailsPopup";
import CreateStockItemForm from "./CreateStockItemForm";

function Inventory() {
  const { inventoryItems, stockNeededItems, isInitialized, addNewItem } =
    useInventory();
  const { currentOrders } = useOrder();
  const [selectedItem, setSelectedItem] = useState(null);
  const [showCurrentOrders, setShowCurrentOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleClosePopup = () => {
    setSelectedItem(null);
  };

  const handleViewOrders = () => {
    setShowCurrentOrders(true);
  };

  const handleCloseOrders = () => {
    setShowCurrentOrders(false);
  };

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowCurrentOrders(false);
  };

  const handleCloseOrderDetails = () => {
    setSelectedOrder(null);
    setShowCurrentOrders(true);
  };

  const handleCreateItem = (newItem) => {
    addNewItem(newItem);
    setShowCreateForm(false);
  };

  const itemOrders = currentOrders.filter((order) =>
    order.lines.some((line) => parseInt(line.itemId, 10) === selectedItem?.id)
  );

  return (
    <div className={styles.inventoryContainer}>
      <CurrentStock
        inventoryItems={inventoryItems}
        onItemClick={handleItemClick}
      />
      <StockNeeded
        stockNeededItems={stockNeededItems}
        inventoryItems={inventoryItems}
        isClickable={false}
        showOrderButton={true}
      />
      <button
        className={`${styles.button} ${styles.createStockItemButton}`}
        onClick={() => setShowCreateForm(true)}
      >
        Create a stock item
      </button>
      {showCreateForm && (
        <CreateStockItemForm
          onClose={() => setShowCreateForm(false)}
          onCreateItem={handleCreateItem}
        />
      )}
      {selectedItem && (
        <StockItemPopup
          item={selectedItem}
          onClose={handleClosePopup}
          onViewOrders={handleViewOrders}
        />
      )}
      {showCurrentOrders && (
        <CurrentOrdersPopup
          orders={itemOrders}
          itemName={selectedItem.name}
          onClose={handleCloseOrders}
          onViewOrderDetails={handleViewOrderDetails}
        />
      )}
      {selectedOrder && (
        <OrderDetailsPopup
          order={selectedOrder}
          onClose={handleCloseOrderDetails}
          highlightedItemId={selectedItem.id}
        />
      )}
    </div>
  );
}
function CurrentStock({ inventoryItems, onItemClick }) {
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
              <td>
                <button
                  className={styles.itemNameButton}
                  onClick={() => onItemClick(item)}
                >
                  {item.name}
                </button>
              </td>
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
