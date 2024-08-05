export const inventoryItems = [
  {
    id: 1,
    name: "Laptop",
    stock: 5,
    minStock: 3,
    suppliers: [
      { id: 1, name: "Supplier A", price: "699" },
      { id: 2, name: "Supplier B", price: "799" },
    ],
  },
  {
    id: 2,
    name: "Monitor",
    stock: 9,
    minStock: 5,
    suppliers: [
      { id: 1, name: "Supplier A", price: "499" },
      { id: 3, name: "Supplier C", price: "300" },
    ],
  },
  {
    id: 3,
    name: "Dock",
    stock: 4,
    minStock: 4,
    suppliers: [
      { id: 1, name: "Supplier A", price: "150" },
      { id: 4, name: "Supplier D", price: "99" },
    ],
  },
  {
    id: 4,
    name: "Keyboard",
    stock: 14,
    minStock: 8,
    suppliers: [{ id: 2, name: "Supplier B", price: "49" }],
  },
];
