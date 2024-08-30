import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FixedSizeList as List } from "react-window";
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
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.openCreateForm) {
      setShowCreateForm(true);
    }
  }, [location]);

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

  const Row = ({ index, style }) => {
    const item = inventoryItems[index];
    return (
      <div style={style} className={styles.tableRow}>
        <button
          className={styles.itemNameButton}
          onClick={() => onItemClick(item)}
        >
          {item.name}
        </button>
        <span>
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
        </span>
        <span>{item.onOrder}</span>
        <span>
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
        </span>
        <button
          className={
            editIndex === index ? styles.saveButton : styles.editButton
          }
          onClick={() =>
            editIndex === index ? handleSave(index) : handleEdit(index)
          }
        >
          {editIndex === index ? "Save" : "Edit"}
        </button>
      </div>
    );
  };

  return (
    <div className={styles.currentStockContainer}>
      <h2>Current Stock</h2>
      <div className={styles.tableHeader}>
        <span>Item</span>
        <span>Stock</span>
        <span>On Order</span>
        <span>Min Stock</span>
        <span>Actions</span>
      </div>
      <List
        height={400}
        itemCount={inventoryItems.length}
        itemSize={35}
        width="100%"
      >
        {Row}
      </List>
    </div>
  );
}

export default Inventory;
