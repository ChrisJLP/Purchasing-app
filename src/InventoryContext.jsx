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

      const newOnOrder = item.onOrder + orderedQuantity;
      const stockNeeded = Math.max(
        0,
        item.minStock - (item.stock + newOnOrder)
      );

      return {
        ...item,
        onOrder: newOnOrder,
        stockNeeded,
      };
    });

    setInventoryItems(updatedItems);
  };

  const recalculateStockNeeded = useCallback(() => {
    setInventoryItems((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        stockNeeded: Math.max(0, item.minStock - (item.stock + item.onOrder)),
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
