import styles from "./styles/Suppliers.module.css";

function Suppliers() {
  return (
    <div className={styles.supplierContainer}>
      <SearchSuppliers />
      <CurrentSupplier />
      <NewSupplierButton />
    </div>
  );
}

function CurrentSupplier() {
  return (
    <div className={styles.currentSupplierContainer}>
      <h2>Current Suppliers</h2>
      <ul className={styles.currentSupplierList}>
        <li className={styles.currentSupplierItem}>
          <span>Supplier A</span>
          <button className={styles.ordersButton}>View Orders</button>
          <button className={styles.ordersButton}>Edit Supplier</button>
        </li>
        <li>
          {" "}
          <span>Supplier B</span>
          <button className={styles.ordersButton}>View Orders</button>
          <button className={styles.ordersButton}>Edit Supplier</button>
        </li>
        <li>
          {" "}
          <span>Supplier C</span>
          <button className={styles.ordersButton}>View Orders</button>
          <button className={styles.ordersButton}>Edit Supplier</button>
        </li>
        <li>
          {" "}
          <span>Supplier D</span>
          <button className={styles.ordersButton}>View Orders</button>
          <button className={styles.ordersButton}>Edit Supplier</button>
        </li>
      </ul>
    </div>
  );
}

function SearchSuppliers() {
  return (
    <div className={styles.searchSuppliersContainer}>
      <h2>Search Suppliers</h2>
      <div className={styles.search}>
        <input type="text" />
        <input type="submit" />
      </div>
    </div>
  );
}

function NewSupplierButton() {
  return (
    <button className={styles.newSupplierButton}>Create a new supplier</button>
  );
}

export default Suppliers;
