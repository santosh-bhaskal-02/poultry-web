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
  ClipboardList,
  Shield,
} from "lucide-react";

const Navbar = () => {
  const [isReportOpen, setReportOpen] = useState(false);
  const [isInventoryOpen, setInventoryOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const reportRef = useRef(null);
  const inventoryRef = useRef(null);
  const navRef = useRef(null);

  // Close dropdowns and mobile menu
  const closeAllMenus = () => {
    setReportOpen(false);
    setInventoryOpen(false);
    setMobileMenuOpen(false);
  };

  const linkClass =
    "text-base font-semibold px-4 py-2.5 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition duration-200 ease-in-out flex items-center gap-2 whitespace-nowrap w-full sm:w-auto";

  const dropdownButtonClass =
    "flex justify-between items-center gap-1 text-base font-semibold px-4 py-2.5 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition duration-200 ease-in-out whitespace-nowrap w-full sm:w-auto";

  const dropdownLinkClass =
    "flex items-center gap-3 px-8 sm:px-4 py-2.5 text-gray-700 hover:bg-emerald-100 hover:text-emerald-700 transition duration-150 ease-in-out";

  // handle outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!isMobileMenuOpen) {
        if (reportRef.current && !reportRef.current.contains(e.target)) {
          setReportOpen(false);
        }
        if (inventoryRef.current && !inventoryRef.current.contains(e.target)) {
          setInventoryOpen(false);
        }
      }
      if (navRef.current && !navRef.current.contains(e.target) && isMobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <div className="shadow-2xl bg-white sticky top-0 z-40 font-sans" ref={navRef}>
      {/* 🔥 TOP BAR */}
      <div className="flex items-center justify-between p-3 bg-slate-800">
        {/* ⭐ Poultry Farm Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 pl-3 group"
          onClick={closeAllMenus}>
          <div className="flex items-center justify-center bg-emerald-600 rounded-full p-2 shadow-md group-hover:bg-emerald-500 transition">
            <Bird className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-2xl font-extrabold tracking-wide lg:text-3xl group-hover:text-gray-200 transition">
            Poultry Manager
          </span>
        </Link>

        {/* Hamburger */}
        <button
          className="sm:hidden p-2 rounded-full text-white hover:bg-slate-700 transition duration-150"
          onClick={() => {
            setMobileMenuOpen(!isMobileMenuOpen);
            setReportOpen(false);
            setInventoryOpen(false);
          }}>
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* 🔥 NAV LINKS */}
      <nav
        className={`
          flex flex-col sm:flex-row items-start sm:items-center bg-white 
          gap-x-2 gap-y-1 p-3 pt-2
          ${isMobileMenuOpen ? "block" : "hidden sm:flex"}
          transition-all duration-300 ease-in-out`}>
        {/* Dashboard */}
        <Link to="/" className={linkClass} onClick={closeAllMenus}>
          <LayoutDashboard className="w-5 h-5 text-emerald-600" />
          Dashboard
        </Link>

        {/* Inventory */}
        <div ref={inventoryRef} className="relative w-full sm:w-auto">
          <button
            onClick={() => {
              setInventoryOpen(!isInventoryOpen);
              if (!isMobileMenuOpen) setReportOpen(false);
            }}
            className={dropdownButtonClass}>
            Inventory
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isInventoryOpen ? "rotate-180 text-emerald-700" : "text-gray-500"
              }`}
            />
          </button>

          {(isMobileMenuOpen || isInventoryOpen) && (
            <div className="w-full sm:absolute sm:left-0 sm:w-56 sm:bg-white sm:rounded-xl sm:shadow-2xl sm:border sm:border-gray-200 sm:mt-3">
              <div className="flex flex-col py-1">
                <Link
                  to="/bird-inventory"
                  className={`${dropdownLinkClass} rounded-t-xl`}
                  onClick={() => setInventoryOpen(false)}>
                  <Bird className="w-5 h-5 text-emerald-600" />
                  Birds Inventory
                </Link>

                <Link
                  to="/feed-inventory"
                  className={`${dropdownLinkClass} rounded-b-xl`}
                  onClick={() => setInventoryOpen(false)}>
                  <Package className="w-5 h-5 text-amber-600" />
                  Feed Inventory
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Reports */}
        <div ref={reportRef} className="relative w-full sm:w-auto">
          <button
            onClick={() => {
              setReportOpen(!isReportOpen);
              if (!isMobileMenuOpen) setInventoryOpen(false);
            }}
            className={dropdownButtonClass}>
            Reports
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isReportOpen ? "rotate-180 text-emerald-700" : "text-gray-500"
              }`}
            />
          </button>

          {(isMobileMenuOpen || isReportOpen) && (
            <div className="w-full sm:absolute sm:left-0 sm:w-56 sm:bg-white sm:rounded-xl sm:shadow-2xl sm:border sm:border-gray-200 sm:mt-3">
              <div className="flex flex-col py-1">
                <Link
                  to="/reports/daily-report"
                  className={`${dropdownLinkClass} rounded-t-xl`}>
                  <ClipboardList className="w-5 h-5 text-emerald-600" />
                  Daily Report
                </Link>

                <Link to="/reports/feed-inventory" className={dropdownLinkClass}>
                  <Wheat className="w-5 h-5 text-amber-600" />
                  Feed Usage
                </Link>

                <Link
                  to="/reports/birds-inventory"
                  className={`${dropdownLinkClass} rounded-b-xl`}>
                  <Bird className="w-5 h-5 text-emerald-600" /> Batch Report
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
