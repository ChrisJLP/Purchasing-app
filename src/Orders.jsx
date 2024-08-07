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

  const handleCloseForm = () => {
    setShowForm(false);
  };
  return (
    <>
      <div className={styles.ordersContainer}>
        <StockNeeded stockNeededItems={stockNeededItems} />
        <RecentOrders />
        <NewOrderButton onClick={handleNewOrderClick} />
        {showForm && <OrderForm onClose={handleCloseForm} />}
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

function OrderForm({ onClose }) {
  const { inventoryItems } = useInventory();
  const [selectedSupplier, setSelectedSupplier] = useState(suppliersData[0]);
  const [orderLines, setOrderLines] = useState([
    { itemId: "", itemName: "", quantity: "", price: "" },
  ]);

  const handleSupplierChange = (e) => {
    const supplierId = parseInt(e.target.value, 10);
    const supplier = suppliersData.find((s) => s.id === supplierId);
    setSelectedSupplier(supplier);
    setOrderLines([
      { itemId: "", itemName: "", quantity: "", price: "", basePrice: "" },
    ]);
  };

  const resetOrderLineFields = (orderLine) => {
    orderLine.itemName = "";
    orderLine.price = "";
    orderLine.quantity = "";
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
        updatedOrderLines[index].quantity = "1";
        const itemSupplier = matchedItem.suppliers.find(
          (supplier) => supplier.id === selectedSupplier.id
        );
        updatedOrderLines[index].basePrice = itemSupplier
          ? itemSupplier.price
          : "";
        updatedOrderLines[index].price = updatedOrderLines[index].basePrice;
      } else {
        resetOrderLineFields(updatedOrderLines[index]);
      }
    } else {
      resetOrderLineFields(updatedOrderLines[index]);
    }

    setOrderLines(updatedOrderLines);
  };

  const handleQtyChange = (index, value) => {
    const updatedOrderLines = [...orderLines];

    if (updatedOrderLines[index].itemName !== "") {
      updatedOrderLines[index].quantity = value;
      updatedOrderLines[index].price =
        updatedOrderLines[index].basePrice * value;
    } else {
      updatedOrderLines[index].quantity = "";
    }
    setOrderLines(updatedOrderLines);
  };

  const handleRemoveLine = (index, event) => {
    event.preventDefault();
    setOrderLines((prevLines) => {
      if (prevLines.length > 1) {
        return prevLines.filter((_, i) => i !== index);
      }
      return prevLines; // Don't remove if it's the last line
    });
  };

  const handleAddLine = () => {
    setOrderLines((prevLines) => {
      if (prevLines.length >= 8) {
        return prevLines;
      }
      return [
        ...prevLines,
        { itemId: "", itemName: "", quantity: "", price: "", basePrice: "" },
      ];
    });
  };

  const handleCloseClick = (e) => {
    e.preventDefault();
    onClose();
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
          <div className={styles.OrderLineHeader}>
            <p></p>
          </div>
          <table className={styles.orderTable}>
            <thead>
              <tr>
                <th>Item ID</th>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody className={styles.orderLine}>
              {orderLines.map((line, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      value={line.itemId}
                      placeholder="Item ID"
                      className={styles.itemIdInput}
                      onChange={(e) =>
                        handleItemIdChange(index, e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={line.itemName}
                      placeholder="Item"
                      readOnly
                      className={styles.itemNameInput}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={line.quantity}
                      placeholder="Qty"
                      className={styles.quantityInput}
                      onChange={(e) => handleQtyChange(index, e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={line.price}
                      placeholder="Price"
                      className={styles.priceInput}
                    />
                  </td>
                  <td>
                    <button onClick={(e) => handleRemoveLine(index, e)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" onClick={handleAddLine}>
            Add New Line
          </button>
          <div className={styles.closeFormButtonContainer}>
            <button
              className={styles.closeFormButton}
              onClick={handleCloseClick}
            >
              Close
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

export default Orders;
