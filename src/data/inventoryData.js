export const inventoryItems = [
  {
    id: 1,
    name: "Laptop",
    stock: 5,
    minStock: 3,
    suppliers: [
      { id: 1, name: "Supplier A" },
      { id: 2, name: "Supplier B" },
    ],
  },
  {
    id: 2,
    name: "Monitor",
    stock: 9,
    minStock: 5,
    suppliers: [{ id: 3, name: "Supplier C" }],
  },
  {
    id: 3,
    name: "Dock",
    stock: 4,
    minStock: 4,
    suppliers: [
      { id: 1, name: "Supplier A" },
      { id: 4, name: "Supplier D" },
    ],
  },
  {
    id: 4,
    name: "Keyboard",
    stock: 14,
    minStock: 8,
    suppliers: [{ id: 2, name: "Supplier B" }],
  },
];
