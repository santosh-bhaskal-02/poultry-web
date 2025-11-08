import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

// Layout & Components
import Navbar from "@/components/Navbar";
import BirdInventory from "@/Pages/BirdInventory";
import FeedInventory from "@/Pages/FeedInventory";
// import DailyReport from "@/components/Reports/DailyReport";
// import BirdsInventoryReport from "@/components/Reports/InventoryReport/BirdsInventoryReport";
// import FeedInventoryReport from "@/components/Reports/InventoryReport/FeedInventoryReport";

// Pages
import DashboardPage from "@/Pages/DashBoard";
import { BirdInventoryPage, DailyReportPage, FeedInventoryPage } from "@/Pages/Reports";

const Layout = () => (
  <>
    <Navbar />
    <main className="p-4 sm:p-0">
      <Outlet />
    </main>
  </>
);

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Shared Layout */}
        <Route element={<Layout />}>
          {/* Dashboard (Home) */}
          <Route path="/" element={<DashboardPage />} />

          {/* Inventory Pages */}
          <Route path="/bird-inventory" element={<BirdInventory />} />
          <Route path="/feed-inventory" element={<FeedInventory />} />

          {/* Reports Section */}
          <Route path="/reports">
            <Route path="daily" element={<DailyReportPage />} />
            <Route path="birds" element={<BirdInventoryPage />} />
            <Route path="feed" element={<FeedInventoryPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
