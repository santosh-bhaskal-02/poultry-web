import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.js";
import Inventory from "./components/Inventory/BirdInventory.js";
import FeedInventory from "./components/Inventory/feedInventory.js";
import DailyRegister from "./components/DailyRegister/DailyRegister.js";
import DailyReport from "./components/Reports/DailyReport/DailyReport.js";
import BirdsInventory from "./components/Reports/InventoryReport/BirdsInventoryReport.js";
import FeedInventoryReport from "./components/Reports/InventoryReport/FeedInventoryReport.js";
import BirdsInventoryReport from "./components/Reports/InventoryReport/BirdsInventoryReport.js";

const Layout: React.FC = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DailyRegister />} />
          <Route path="/bird-inventory" element={<Inventory />} />
          <Route path="/feed-inventory" element={<FeedInventory />} />
          <Route path="/reports">
            <Route path="daily-report" element={<DailyReport />} />
            <Route path="birdsInventory-report" element={<BirdsInventoryReport />} />
            <Route path="feedInventory-report" element={<FeedInventoryReport />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
