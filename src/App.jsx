import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./styles/App.css";
import Navigation from "./Navigation";
import { Dashboard } from "./Dashboard";
import Orders from "./Orders";
import Inventory from "./Inventory";
import Suppliers from "./Suppliers";

function App() {
  return (
    <Router>
      <div>
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/suppliers" element={<Suppliers />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
