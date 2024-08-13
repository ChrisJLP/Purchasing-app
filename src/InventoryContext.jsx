import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { inventoryItems as initialInventoryItems } from "./data/inventoryData";

const InventoryContext = createContext();

export function InventoryProvider({ children }) {
  const [inventoryItems, setInventoryItems] = useState(initialInventoryItems);

  const updateStockNeeded = useCallback((newOrder) => {
    setInventoryItems((prevItems) =>
      prevItems.map((item) => {
        const orderLine = newOrder.lines.find(
          (line) => parseInt(line.itemId) === item.id
        );
        const orderedQuantity = orderLine ? parseInt(orderLine.quantity) : 0;

        return {
          ...item,
          onOrder: item.onOrder + orderedQuantity,
          stockNeeded: Math.max(
            0,
            item.minStock - (item.stock + item.onOrder + orderedQuantity)
          ),
        };
      })
    );
  }, []);

  const recalculateStockNeeded = useCallback(() => {
    setInventoryItems((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        stockNeeded: Math.max(0, item.minStock - (item.stock + item.onOrder)),
      }))
    );
  }, []);

  const updateStockLevel = useCallback((index, newStock, newMinStock) => {
    setInventoryItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index] = {
        ...updatedItems[index],
        stock: parseInt(newStock),
        minStock: parseInt(newMinStock),
      };
      return updatedItems.map((item) => ({
        ...item,
        stockNeeded: Math.max(0, item.minStock - (item.stock + item.onOrder)),
      }));
    });
  }, []);

  const stockNeededItems = useMemo(() => {
    return inventoryItems
      .filter((item) => item.stockNeeded > 0)
      .map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.stockNeeded,
      }));
  }, [inventoryItems]);

  return (
    <InventoryContext.Provider
      value={{
        inventoryItems,
        setInventoryItems,
        updateStockNeeded,
        recalculateStockNeeded,
        updateStockLevel,
        stockNeededItems,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  return useContext(InventoryContext);
}
