import React, { useState, useEffect } from "react";
import styles from "./styles/Orders.module.css";
import StockNeeded from "./StockNeeded";
import { useInventory } from "./InventoryContext";
import { useOrder } from "./OrderContext";
import { suppliersData } from "./data/suppliersData";
import OrderDetailsPopup from "./OrderDetailsPopup";

function Orders() {
  const { recalculateStockNeeded, stockNeededItems, inventoryItems } =
    useInventory();
  const {
    showForm,
    setShowForm,
    selectedSupplier,
    setSelectedSupplier,
    orderLines,
    setOrderLines,
    currentOrders,
  } = useOrder();

  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    recalculateStockNeeded();
    setIsLoading(false);
  }, [recalculateStockNeeded]);

  const handleNewOrderClick = () => {
    setShowForm(!showForm);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const onOrderClick = (order) => {
    setSelectedOrder(order);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className={styles.ordersContainer}>
        <StockNeeded
          stockNeededItems={stockNeededItems}
          inventoryItems={inventoryItems}
          isClickable={true}
          showOrderButton={false}
          isOrdersPage={true}
        />
        <CurrentOrders orders={currentOrders} onOrderClick={onOrderClick} />
        <NewOrderButton onClick={handleNewOrderClick} />
        {showForm && (
          <OrderForm
            onClose={handleCloseForm}
            selectedSupplier={selectedSupplier}
            setSelectedSupplier={setSelectedSupplier}
            orderLines={orderLines}
            setOrderLines={setOrderLines}
          />
        )}
      </div>
      {selectedOrder && (
        <OrderDetailsPopup
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
}

function CurrentOrders({ orders, onOrderClick }) {
  if (!orders || !Array.isArray(orders) || orders.length == 0) {
    return (
      <div className={styles.currentOrdersContainer}>
        <h2>Current Orders</h2>
        <p>No current orders.</p>
      </div>
    );
  }

  const groupedOrders = orders.reduce((acc, order) => {
    if (!acc[order.deliveryDate]) {
      acc[order.deliveryDate] = [];
    }
    acc[order.deliveryDate].push(order);
    return acc;
  }, {});

  return (
    <>
      <div className={styles.currentOrdersContainer}>
        <h2>Current Orders</h2>
        <ul className={styles.currentOrdersList}>
          {Object.entries(groupedOrders).map(([date, dateOrders]) =>
            dateOrders.map((order, index) => (
              <li
                key={`${date}-${index}`}
                className={styles.orderItem}
                onClick={() => onOrderClick(order)}
              >
                {order.lines.map((line, lineIndex) => (
                  <span
                    key={`${line.itemId}-${lineIndex}`}
                    className={styles.orderLine}
                  >
                    {line.quantity}x {line.itemName} - Due{" "}
                    {new Date(date).toLocaleDateString("en-GB")}
                  </span>
                ))}
              </li>
            ))
          )}
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
  const {
    selectedSupplier,
    setSelectedSupplier,
    orderLines,
    setOrderLines,
    deliveryDate,
    setDeliveryDate,
    placeOrder,
  } = useOrder();

  const handleDeliveryDateChange = (e) => {
    setDeliveryDate(e.target.value);
  };

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

    if (
      selectedSupplier &&
      selectedSupplier.itemIds.includes(parseInt(value))
    ) {
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
      if (prevLines.length >= 6) {
        return prevLines;
      }
      return [
        ...prevLines,
        { itemId: "", itemName: "", quantity: "", price: "", basePrice: "" },
      ];
    });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const order = {
      supplier: selectedSupplier,
      lines: orderLines,
      deliveryDate,
      date: new Date().toISOString(),
    };
    placeOrder(order);
    onClose();
  };

  const handleCloseClick = (e) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handlePlaceOrder}>
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
          <div className={styles.formGroup}>
            <label htmlFor="deliveryDate" className={styles.label}>
              Delivery Date:
            </label>
            <input
              type="date"
              id="deliveryDate"
              name="deliveryDate"
              value={deliveryDate}
              onChange={handleDeliveryDateChange}
              className={styles.dateInput}
            />
          </div>
          <div className={styles.formGroup}>
            <button type="submit" className={styles.placeOrderButton}>
              Place Order
            </button>
          </div>
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
