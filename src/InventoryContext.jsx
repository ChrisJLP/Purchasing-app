import React, { createContext, useState, useContext } from "react";
import { inventoryItems as initialInventoryItems } from "./data/inventoryData";

const InventoryContext = createContext();

export function InventoryProvider({ children }) {
  const [inventoryItems, setInventoryItems] = useState(initialInventoryItems);

  return (
    <InventoryContext.Provider value={{ inventoryItems, setInventoryItems }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  return useContext(InventoryContext);
}
