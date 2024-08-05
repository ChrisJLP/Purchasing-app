import React, { useState } from "react";
import styles from "./styles/Orders.module.css";
import StockNeeded from "./StockNeeded";
import { useInventory } from "./InventoryContext";
import { suppliersData } from "./data/suppliersData";

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
  const { inventoryItems } = useInventory();
  const [selectedSupplier, setSelectedSupplier] = useState(suppliersData[0]);
  const [orderLines, setOrderLines] = useState([
    { itemId: "", itemName: "", quantity: "", price: "" },
  ]);

  const handleSupplierChange = (e) => {
    const supplierId = parseInt(e.target.value, 10);
    const supplier = suppliersData.find((s) => s.id === supplierId);
    setSelectedSupplier(supplier);
    setOrderLines([{ itemId: "", itemName: "", quantity: "", price: "" }]);
  };

  const handleItemIdChange = (index, value) => {
    const updatedOrderLines = [...orderLines];
    updatedOrderLines[index].itemId = value;

    if (selectedSupplier.itemIds.includes(parseInt(value))) {
      const matchedItem = inventoryItems.find(
        (item) => item.id === parseInt(value)
      );
      if (matchedItem) {
        updatedOrderLines[index].itemName = matchedItem.name;
        const itemSupplier = matchedItem.suppliers.find(
          (supplier) => supplier.id === selectedSupplier.id
        );
        updatedOrderLines[index].price = itemSupplier ? itemSupplier.price : "";
      } else {
        updatedOrderLines[index].itemName = "";
        updatedOrderLines[index].price = "";
        updatedOrderLines[index].quantity = "";
      }
    } else {
      updatedOrderLines[index].itemName = "";
      updatedOrderLines[index].price = "";
      updatedOrderLines[index].quantity = "";
    }
    setOrderLines(updatedOrderLines);
  };

  const handleQtyChange = (index, value) => {
    const updatedOrderLines = [...orderLines];

    if (updatedOrderLines[index].itemName !== "") {
      updatedOrderLines[index].quantity = value;
      updatedOrderLines[index].price = updatedOrderLines[index].price * value;
    } else {
      updatedOrderLines[index].quantity = "";
    }
    setOrderLines(updatedOrderLines);
  };

  return (
    <div className={styles.formContainer}>
      <form>
        <fieldset>
          <legend>New Order</legend>
          <div className={styles.formGroup}>
            <label htmlFor="supplier" name="supplier" className={styles.label}>
              Supplier:
            </label>
            <select
              name="supplier"
              id="supplier"
              className={styles.select}
              onChange={handleSupplierChange}
            >
              {suppliersData.map((supplier) => (
                <option
                  key={supplier.id}
                  value={supplier.id}
                  className={styles.option}
                >
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            {orderLines.map((line, index) => (
              <>
                <input
                  type="text"
                  value={line.itemId}
                  placeholder="Item ID"
                  className={styles.input}
                  onChange={(e) => handleItemIdChange(index, e.target.value)}
                />
                <input
                  type="text"
                  value={line.itemName}
                  placeholder="Item"
                  readOnly
                  className={styles.input}
                />
                <input
                  type="number"
                  value={line.quantity}
                  placeholder="Qty"
                  className={styles.input}
                  onChange={(e) => handleQtyChange(index, e.target.value)}
                />
                <input
                  type="number"
                  value={line.price}
                  placeholder="Price"
                  className={styles.input}
                />
              </>
            ))}
          </div>
          <div className={styles.closeFormButtonContainer}>
            <button className={styles.closeFormButton}>Close</button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

export default Orders;
