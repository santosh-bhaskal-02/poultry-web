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
import { Toaster } from "sonner";
import BottomNavBar from "@/components/Navbar/BottomNavbar";
const Layout = () => (
  <>
    <Navbar />
    <main>
      <Outlet />
    </main>
    <BottomNavBar />
    <Toaster richColors position="top-right" closeButton />
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
            <Route path="daily-report" element={<DailyReportPage />} />
            <Route path="birds-inventory" element={<BirdInventoryPage />} />
            <Route path="feed-inventory" element={<FeedInventoryPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
