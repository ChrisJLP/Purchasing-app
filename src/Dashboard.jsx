function Dashboard() {
  return (
    <div>
      <Navigation />
      <StockNeeded />
      <CustomerOrders />
      <SupplierOrders />
      <QuickLinks />
    </div>
  );
}

function Navigation() {
  return (
    <nav>
      <ul>
        <li>Dashboard</li>
        <li>Orders</li>
        <li>Inventory</li>
        <li>Suppliers</li>
      </ul>
    </nav>
  );
}

function StockNeeded() {
  return (
    <div>
      <h2>Stock needed</h2>
      <ul>
        <li>5x Asus Laptops</li>
        <li>2x Monitors</li>
        <li>3x Lenovo laptop</li>
        <li>10x keyboard</li>
      </ul>
      <button>Place orders</button>
    </div>
  );
}

function CustomerOrders() {
  return (
    <div>
      <h2>Recent Customer Orders</h2>
      <ul>
        <li>2x Keyboards</li>
        <li>1x Monitor</li>
        <li>3x Asus Laptops</li>
      </ul>
    </div>
  );
}

function SupplierOrders() {
  return (
    <div>
      <h2>Recent Supplier Orders</h2>
      <ul>
        <li>2x Monitors - due 05/08</li>
        <li>3x Docks - due 22/07</li>
      </ul>
    </div>
  );
}

function QuickLinks() {
  return (
    <div>
      <h2>Quick Links</h2>
      <ul>
        <li>Create Order</li>
        <li>Search Item</li>
        <li>Search Supplier</li>
        <li>Create Item</li>
        <li>Create Supplier</li>
      </ul>
    </div>
  );
}

export default Dashboard;
