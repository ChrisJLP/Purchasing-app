import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./styles/Orders.module.css";
import StockNeeded from "./StockNeeded";
import { useInventory } from "./InventoryContext";
import { useOrder } from "./OrderContext";
import { useSupplier } from "./SupplierContext";
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
  const location = useLocation();
  const { getActiveSuppliers } = useSupplier();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [quickOrderData, setQuickOrderData] = useState(null);

  useEffect(
    () => {
      recalculateStockNeeded();
      setIsLoading(false);

      if (location.state && location.state.openOrderForm) {
        setShowForm(true);
      }
    },
    [recalculateStockNeeded],
    location.state,
    setShowForm
  );

  const handleQuickOrder = (supplierName, items) => {
    const supplier = getActiveSuppliers().find((s) => s.name === supplierName);
    const newOrderLines = items.map((item) => {
      const fullItem = inventoryItems.find((invItem) => invItem.id === item.id);
      const supplierInfo = fullItem.suppliers.find((s) => s.id === supplier.id);
      const supplierPrice = supplierInfo ? parseFloat(supplierInfo.price) : 0;
      return {
        itemId: item.id,
        itemName: item.name,
        quantity: item.quantity,
        price: (supplierPrice * item.quantity).toFixed(2),
        basePrice: supplierPrice.toFixed(2),
      };
    });

    if (showForm && orderLines.length > 0) {
      setShowConfirmation(true);
      setQuickOrderData({ supplier, orderLines: newOrderLines });
    } else {
      applyQuickOrder({ supplier, orderLines: newOrderLines });
    }
  };

  const applyQuickOrder = (data) => {
    setSelectedSupplier(data.supplier);
    setOrderLines(data.orderLines);
    setShowForm(true);
    setShowConfirmation(false);
    setQuickOrderData(null);
  };

  const handleConfirmQuickOrder = () => {
    applyQuickOrder(quickOrderData);
  };

  const handleCancelQuickOrder = () => {
    setShowConfirmation(false);
    setQuickOrderData(null);
  };

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
          onQuickOrder={handleQuickOrder}
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
            activeSuppliers={getActiveSuppliers()}
          />
        )}
      </div>
      {selectedOrder && (
        <OrderDetailsPopup
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
      {showConfirmation && (
        <div className={styles.confirmationOverlay}>
          <div className={styles.confirmationBox}>
            <p>This will override your current order. Are you sure?</p>
            <button onClick={handleConfirmQuickOrder}>Yes, proceed</button>
            <button onClick={handleCancelQuickOrder}>Cancel</button>
          </div>
        </div>
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
                <span className={styles.orderNumber}>
                  Order Number: {order.orderNumber}
                </span>
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

function OrderForm({
  onClose,
  activeSuppliers,
  selectedSupplier,
  setSelectedSupplier,
  orderLines,
  setOrderLines,
}) {
  const { inventoryItems } = useInventory();
  const { deliveryDate, setDeliveryDate, placeOrder } = useOrder();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (
      selectedSupplier &&
      !activeSuppliers.some((s) => s.id === selectedSupplier.id)
    ) {
      setSelectedSupplier(null);
      setOrderLines([]);
      setErrorMessage(
        "The previously selected supplier is no longer available."
      );
    }
  }, [selectedSupplier, activeSuppliers, setSelectedSupplier, setOrderLines]);

  useEffect(() => {
    if (selectedSupplier && orderLines.length === 0) {
      setOrderLines([
        { itemId: "", itemName: "", quantity: "", price: "", basePrice: "" },
      ]);
    }
  }, [selectedSupplier, orderLines.length, setOrderLines]);

  const handleDeliveryDateChange = (e) => {
    setDeliveryDate(e.target.value);
  };

  const handleSupplierChange = (e) => {
    const supplierId = parseInt(e.target.value, 10);
    const supplier = suppliersData.find((s) => s.id === supplierId);
    setSelectedSupplier(supplier);
    setOrderLines([]);
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

  const validateOrder = () => {
    if (!selectedSupplier) {
      return "Please select an active supplier.";
    }
    if (!deliveryDate) {
      return "Please select a delivery date.";
    }
    if (orderLines.length === 0) {
      return "Please add at least one item to the order.";
    }
    for (const line of orderLines) {
      if (!line.itemId || !line.quantity || parseInt(line.quantity) <= 0) {
        return "Please ensure all order lines have a valid item ID and quantity.";
      }
    }
    return "";
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const error = validateOrder();

    if (error) {
      setErrorMessage(error);
    } else {
      const order = {
        supplier: selectedSupplier,
        lines: orderLines,
        deliveryDate,
        date: new Date().toISOString(),
      };
      placeOrder(order);
      onClose();
    }
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
              value={
                selectedSupplier &&
                activeSuppliers.some((s) => s.id === selectedSupplier.id)
                  ? selectedSupplier.id
                  : ""
              }
            >
              <option value="">Select a supplier</option>
              {activeSuppliers.map((supplier) => (
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
      {errorMessage && (
        <ErrorPopup
          message={errorMessage}
          onClose={() => setErrorMessage("")}
        />
      )}
    </div>
  );
}

function ErrorPopup({ message, onClose }) {
  console.log("Error!");
  return (
    <div className={styles.errorPopup}>
      <div className={styles.errorContent}>
        <h3>Error</h3>
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default Orders;
