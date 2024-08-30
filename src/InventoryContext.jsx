import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { inventoryItems as initialInventoryItems } from "./data/inventoryData";

const InventoryContext = createContext();

export function InventoryProvider({ children }) {
  const [inventoryItems, setInventoryItems] = useState(initialInventoryItems);
  const [lastItemId, setLastItemId] = useState(
    Math.max(...initialInventoryItems.map((item) => item.id))
  );
  const [isInitialized, setIsInitialized] = useState(false);

  const calculateStockNeeded = useCallback((items) => {
    return items.map((item) => ({
      ...item,
      stockNeeded: Math.max(0, item.minStock - (item.stock + item.onOrder)),
    }));
  }, []);

  const initializeInventory = useCallback(() => {
    setInventoryItems((prevItems) => calculateStockNeeded(prevItems));
    setIsInitialized(true);
  }, [calculateStockNeeded]);

  useEffect(() => {
    if (!isInitialized) {
      initializeInventory();
    }
  }, [isInitialized, initializeInventory]);

  const updateStockNeeded = useCallback(
    (newOrder) => {
      setInventoryItems((prevItems) =>
        calculateStockNeeded(
          prevItems.map((item) => {
            const orderLine = newOrder.lines.find(
              (line) => parseInt(line.itemId) === item.id
            );
            const orderedQuantity = orderLine
              ? parseInt(orderLine.quantity)
              : 0;

            return {
              ...item,
              onOrder: item.onOrder + orderedQuantity,
            };
          })
        )
      );
    },
    [calculateStockNeeded]
  );

  const addNewItem = useCallback(
    (newItem) => {
      setLastItemId((prevId) => {
        const nextId = prevId + 1;
        setInventoryItems((prevItems) => {
          const itemWithId = { ...newItem, id: nextId, onOrder: 0 };
          const updatedItems = [...prevItems, itemWithId];
          return calculateStockNeeded(updatedItems);
        });
        return nextId;
      });
    },
    [calculateStockNeeded]
  );

  const contextValue = useMemo(
    () => ({
      inventoryItems,
      setInventoryItems,
      updateStockNeeded,
      recalculateStockNeeded: useCallback(() => {
        setInventoryItems((prevItems) => calculateStockNeeded(prevItems));
      }, [calculateStockNeeded]),
      updateStockLevel: useCallback(
        (index, newStock, newMinStock) => {
          setInventoryItems((prevItems) => {
            const updatedItems = [...prevItems];
            updatedItems[index] = {
              ...updatedItems[index],
              stock: parseInt(newStock),
              minStock: parseInt(newMinStock),
            };
            return calculateStockNeeded(updatedItems);
          });
        },
        [calculateStockNeeded]
      ),
      stockNeededItems: inventoryItems
        .filter((item) => item.stockNeeded > 0)
        .map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.stockNeeded,
        })),
      isInitialized,
      addNewItem,
    }),
    [
      inventoryItems,
      isInitialized,
      calculateStockNeeded,
      updateStockNeeded,
      addNewItem,
    ]
  );

  return (
    <InventoryContext.Provider value={contextValue}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  return useContext(InventoryContext);
}
