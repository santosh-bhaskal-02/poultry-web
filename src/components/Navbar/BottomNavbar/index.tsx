import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  Package,
  ListOrdered,
  LayoutDashboard,
  Bird,
  Wheat,
  Menu,
  X,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AddDailyRecordModal from "@/components/Common/Modal/AddDailyRecordModal";

// Renamed the component to reflect its new position
const BottomNavBar = () => {
  const [isReportOpen, setReportOpen] = useState(false);
  const [isInventoryOpen, setInventoryOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOpenModal, setOpenModal] = useState(false);

  const reportRef = useRef(null);
  const inventoryRef = useRef(null);
  const navRef = useRef(null);

  // Helper to close all menus (dropdowns and mobile menu)
  const closeAllMenus = () => {
    setReportOpen(false);
    setInventoryOpen(false);
    setMobileMenuOpen(false);
  };

  const handleLinkClick = (setter) => {
    setter(false);
    // Close the entire mobile menu when a link is clicked
    setMobileMenuOpen(false);
  };

  // --- Aesthetic Classes (Retained) ---
  const linkClass =
    "text-base font-medium px-4 py-3 rounded-xl text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition duration-200 ease-in-out flex items-center gap-2 whitespace-nowrap w-full sm:w-auto";

  const dropdownButtonClass =
    "flex justify-between items-center gap-1 text-base font-medium px-4 py-3 rounded-xl text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition duration-200 ease-in-out whitespace-nowrap w-full sm:w-auto";

  const dropdownLinkClass =
    "flex items-center gap-3 px-10 sm:px-4 py-2 text-gray-700 hover:bg-blue-100/50 hover:text-blue-700 transition duration-150 ease-in-out";
  // ------------------------------------

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Only close dropdowns on desktop/tablet if the full mobile menu is not active
      if (!isMobileMenuOpen) {
        if (reportRef.current && !reportRef.current.contains(e.target)) {
          setReportOpen(false);
        }
        if (inventoryRef.current && !inventoryRef.current.contains(e.target)) {
          setInventoryOpen(false);
        }
      }
      // Close the mobile menu if clicking outside the nav area
      if (navRef.current && !navRef.current.contains(e.target) && isMobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <>
      <div
        className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-2xl border-t-1 border-gray-300 sm:hidden"
        ref={navRef}>
        <div className="flex items-center justify-between p-3">
          {/* You could place a quick-access link here, e.g., Dashboard */}
          <Link
            to="/"
            className="text-white flex flex-col items-center p-1 rounded-lg bg-blue-600 hover:bg-blue-500 transition"
            onClick={closeAllMenus}>
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-xs font-medium">Dashboard</span>
          </Link>

          {/* Hamburger/Close Button is the main trigger */}

          <Button
            onClick={() => setOpenModal(true)}
            className="w-12 h-12 rounded-full bg-amber-400 shadow-2xl transition-transform duration-300 hover:scale-105 hover:bg-amber-500 hover:shadow-lg focus:ring-blue-300">
            <Plus className="w-7 h-7" />
          </Button>
          <AddDailyRecordModal
            open={isOpenModal}
            onClose={() => setOpenModal(!isOpenModal)}
          />

          {/* Placeholder for another quick link (e.g., Inventory) */}
          <button
            className="p-3 rounded-full text-white bg-blue-700 hover:bg-blue-500 transition duration-150"
            onClick={() => {
              setMobileMenuOpen(!isMobileMenuOpen);
              setReportOpen(false);
              setInventoryOpen(false);
            }}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 2. OVERLAY MENU CONTENT (Visible only when toggled) */}
      {/* 🌟 NEW STRUCTURE: Full-screen overlay for mobile, hidden on desktop (sm:flex) */}
      <nav
        className={`
          flex flex-col items-start bg-white shadow-2xl absolute w-full 
          transition-all duration-300 ease-in-out z-40 p-5 
          ${
            isMobileMenuOpen
              ? "visible opacity-100 h-auto bottom-16" // Start above the fixed bottom bar
              : "invisible opacity-0 h-0 bottom-16"
          }
          sm:flex sm:flex-row sm:items-center sm:visible sm:h-auto sm:opacity-100 sm:static sm:bg-white sm:shadow-none sm:p-3 sm:z-auto sm:gap-x-2 sm:gap-y-1`}>
        <div ref={inventoryRef} className="relative w-full sm:w-auto">
          <button
            onClick={() => {
              if (isMobileMenuOpen) {
                setInventoryOpen(!isInventoryOpen);
              } else {
                setInventoryOpen(!isInventoryOpen);
                setReportOpen(false);
              }
            }}
            className={dropdownButtonClass}>
            Inventory
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                isInventoryOpen && !isMobileMenuOpen
                  ? "rotate-180 text-blue-600"
                  : "rotate-0 text-gray-500"
              } sm:${
                isInventoryOpen ? "rotate-180 text-blue-600" : "rotate-0 text-gray-500"
              }`}
            />
          </button>

          <div
            className={`
            w-full sm:absolute sm:left-0 sm:mt-3 sm:w-56 sm:bg-white sm:rounded-xl sm:shadow-2xl sm:border sm:border-gray-200 
            sm:transition-all sm:duration-200 sm:transform sm:origin-top-left sm:z-10
            ${
              isMobileMenuOpen
                ? "static visible h-auto opacity-100 shadow-none border-none"
                : isInventoryOpen
                ? "scale-100 opacity-100 visible"
                : "scale-95 opacity-0 invisible"
            }`}>
            {(isMobileMenuOpen || isInventoryOpen) && (
              <div className="flex flex-col py-1">
                <Link
                  to="/bird-inventory"
                  onClick={() => handleLinkClick(setInventoryOpen)}
                  className={`${dropdownLinkClass} rounded-t-xl sm:rounded-none`}>
                  <Bird className="w-5 h-5 text-green-500" />
                  Birds Inventory
                </Link>

                <Link
                  to="/feed-inventory"
                  onClick={() => handleLinkClick(setInventoryOpen)}
                  className={`${dropdownLinkClass} rounded-b-xl sm:rounded-none`}>
                  <Package className="w-5 h-5 text-yellow-500" />
                  Feed Inventory
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Reports Dropdown - Stacked List on Mobile */}
        <div ref={reportRef} className="relative w-full sm:w-auto">
          <button
            onClick={() => {
              if (isMobileMenuOpen) {
                setReportOpen(!isReportOpen);
              } else {
                setReportOpen(!isReportOpen);
                setInventoryOpen(false);
              }
            }}
            className={dropdownButtonClass}>
            Reports
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                isReportOpen && !isMobileMenuOpen
                  ? "rotate-180 text-blue-600"
                  : "rotate-0 text-gray-500"
              } sm:${
                isReportOpen ? "rotate-180 text-blue-600" : "rotate-0 text-gray-500"
              }`}
            />
          </button>

          <div
            className={`
            w-full sm:absolute sm:left-0 sm:mt-3 sm:w-56 sm:bg-white sm:rounded-xl sm:shadow-2xl sm:border sm:border-gray-200 
            sm:transition-all sm:duration-200 sm:transform sm:origin-top-left sm:z-10
            ${
              isMobileMenuOpen
                ? "static visible h-auto opacity-100 shadow-none border-none"
                : isReportOpen
                ? "scale-100 opacity-100 visible"
                : "scale-95 opacity-0 invisible"
            }`}>
            {(isMobileMenuOpen || isReportOpen) && (
              <div className="flex flex-col py-1">
                <Link
                  to="/reports/daily-report"
                  onClick={() => handleLinkClick(setReportOpen)}
                  className={`${dropdownLinkClass} rounded-t-xl sm:rounded-none`}>
                  <ListOrdered className="w-5 h-5 text-blue-600" />
                  Daily Report
                </Link>

                <Link
                  to="/reports/feed-inventory"
                  onClick={() => handleLinkClick(setReportOpen)}
                  className={dropdownLinkClass}>
                  <Wheat className="w-5 h-5 text-yellow-600" />
                  Feed Usage Report
                </Link>

                <Link
                  to="/reports/birds-inventory"
                  onClick={() => handleLinkClick(setReportOpen)}
                  className={`${dropdownLinkClass} rounded-b-xl sm:rounded-none`}>
                  <Bird className="w-5 h-5 text-green-600" /> Batch Report
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default BottomNavBar;
