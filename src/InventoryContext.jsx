import React, { createContext, useState, useContext, useCallback } from "react";
import { inventoryItems as initialInventoryItems } from "./data/inventoryData";

const InventoryContext = createContext();

export function InventoryProvider({ children }) {
  const [inventoryItems, setInventoryItems] = useState(initialInventoryItems);

  const updateStockNeeded = (currentOrders) => {
    const updatedItems = inventoryItems.map((item) => {
      const orderedQuantity = currentOrders.reduce((total, order) => {
        const orderLine = order.lines.find(
          (line) => parseInt(line.itemId) === item.id
        );
        return total + (orderLine ? parseInt(orderLine.quantity) : 0);
      }, 0);

      const newStock = item.stock + orderedQuantity;
      const stockNeeded = Math.max(0, item.minStock - newStock);

      return {
        ...item,
        stock: newStock,
        stockNeeded,
      };
    });

    setInventoryItems(updatedItems);
  };

  const recalculateStockNeeded = useCallback(() => {
    setInventoryItems((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        stockNeeded: Math.max(0, item.minStock - item.stock),
      }))
    );
  }, []);

  return (
    <InventoryContext.Provider
      value={{
        inventoryItems,
        setInventoryItems,
        updateStockNeeded,
        recalculateStockNeeded,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  return useContext(InventoryContext);
}
