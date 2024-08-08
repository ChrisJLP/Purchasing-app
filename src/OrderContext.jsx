import React, { createContext, useState, useContext, useEffect } from "react";
import { suppliersData } from "./data/suppliersData";
import { useInventory } from "./InventoryContext";

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [showForm, setShowForm] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(suppliersData[0]);
  const [orderLines, setOrderLines] = useState([
    { itemId: "", itemName: "", quantity: "", price: "", basePrice: "" },
  ]);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [currentOrders, setCurrentOrders] = useState([]);
  const { updateStockNeeded } = useInventory();

  const placeOrder = (order) => {
    const newOrders = [...currentOrders, order];
    setCurrentOrders(newOrders);
    updateStockNeeded(newOrders);
    setShowForm(false);
    setOrderLines([
      { itemId: "", itemName: "", quantity: "", price: "", basePrice: "" },
    ]);
    setDeliveryDate(new Date().toISOString().split("T")[0]);
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDeliveryDate(today);
  }, []);

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
