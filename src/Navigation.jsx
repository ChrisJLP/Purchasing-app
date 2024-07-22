import { NavLink } from "react-router-dom";
import styles from "./styles/Navigation.module.css";

function Navigation() {
  return (
    <nav className={styles.nav}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? styles.navItemActive : styles.navItem
            }
          >
            Dashboard
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              isActive ? styles.navItemActive : styles.navItem
            }
          >
            Orders
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink
            to="/inventory"
            className={({ isActive }) =>
              isActive ? styles.navItemActive : styles.navItem
            }
          >
            Inventory
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink
            to="/suppliers"
            className={({ isActive }) =>
              isActive ? styles.navItemActive : styles.navItem
            }
          >
            Suppliers
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
