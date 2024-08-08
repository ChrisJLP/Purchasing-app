import React, { createContext, useState, useContext, useEffect } from "react";
import { suppliersData } from "./data/suppliersData";

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [showForm, setShowForm] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(suppliersData[0]);
  const [orderLines, setOrderLines] = useState([
    { itemId: "", itemName: "", quantity: "", price: "" },
  ]);
  const [deliveryDate, setDeliveryDate] = useState("");

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
        setOrderLines,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  return useContext(OrderContext);
}
