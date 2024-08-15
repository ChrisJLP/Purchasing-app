import React, { createContext, useState, useContext } from "react";
import { useInventory } from "./InventoryContext";

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [showForm, setShowForm] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [orderLines, setOrderLines] = useState([]);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [currentOrders, setCurrentOrders] = useState([]);
  const { updateStockNeeded } = useInventory();

  const placeOrder = (order) => {
    setCurrentOrders((prevOrders) => [...prevOrders, order]);
    updateStockNeeded(order);
    setShowForm(false);
    setOrderLines([]);
    setSelectedSupplier(null);
    setDeliveryDate("");
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
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  return useContext(OrderContext);
}
