import React, { createContext, useState, useContext } from "react";
import { useInventory } from "./InventoryContext";

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [showForm, setShowForm] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [orderLines, setOrderLines] = useState([]);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [currentOrders, setCurrentOrders] = useState([]);
  const [lastOrderNumber, setLastOrderNumber] = useState(0);
  const { updateStockNeeded } = useInventory();

  const getNextOrderNumber = () => {
    const nextNumber = lastOrderNumber + 1;
    setLastOrderNumber(nextNumber);
    return nextNumber.toString().padStart(4, "0");
  };

  const placeOrder = (order) => {
    const orderNumber = getNextOrderNumber();
    const newOrder = {
      ...order,
      orderNumber,
    };
    setCurrentOrders((prevOrders) => [...prevOrders, newOrder]);
    updateStockNeeded(newOrder);
    setShowForm(false);
    setOrderLines([]);
    setSelectedSupplier(null);
    setDeliveryDate("");
  };

  const hasCurrentOrders = (supplierId) => {
    return currentOrders.some((order) => order.supplier.id === supplierId);
  };

  return (
    <OrderContext.Provider
      value={{
        showForm,
        setShowForm,
        selectedSupplier,
        setSelectedSupplier,
        orderLines,
        deliveryDate,
        setDeliveryDate,
        setOrderLines,
        currentOrders,
        placeOrder,
        hasCurrentOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  return useContext(OrderContext);
}
