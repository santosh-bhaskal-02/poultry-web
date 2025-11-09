import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  Package,
  ListOrdered,
  LayoutDashboard,
  Bird,
  Wheat,
} from "lucide-react";

const Navbar = () => {
  const [isReportOpen, setReportOpen] = useState(false);
  const [isInventoryOpen, setInventoryOpen] = useState(false);

  const reportRef = useRef(null);
  const inventoryRef = useRef(null);

  const handleLinkClick = (setter) => {
    setter(false);
  };

  const linkClass =
    "text-base font-semibold px-4 py-2 rounded-full text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition duration-150 ease-in-out flex items-center gap-2 whitespace-nowrap";
  const dropdownButtonClass =
    "flex items-center gap-1 text-base font-semibold px-4 py-2 rounded-full text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition duration-150 ease-in-out whitespace-nowrap";
  const dropdownLinkClass =
    "flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition duration-150 ease-in-out";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (reportRef.current && !reportRef.current.contains(e.target)) {
        setReportOpen(false);
      }

      if (inventoryRef.current && !inventoryRef.current.contains(e.target)) {
        setInventoryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="shadow-lg bg-white sticky top-0 z-50">
      <div className="p-4 bg-gray-50 border-b border-gray-100">
        <h1 className="text-blue-600 text-xl font-extrabold tracking-wider sm:text-3xl">
          Daily Poultry Management
        </h1>
      </div>

      <nav className="flex flex-row items-center flex-wrap gap-x-2 gap-y-1 p-3 pt-2">
        <Link to="/" className={linkClass}>
          <LayoutDashboard className="w-5 h-5 text-blue-500" />
          Dashboard
        </Link>

        <div ref={inventoryRef} className="relative">
          <button
            onClick={() => {
              setInventoryOpen(!isInventoryOpen);
              setReportOpen(false);
            }}
            className={dropdownButtonClass}>
            Inventory
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                isInventoryOpen ? "rotate-180 text-blue-600" : "rotate-0 text-gray-500"
              }`}
            />
          </button>

          <div
            className={`absolute left-0 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-gray-100
            transition-all duration-200 transform origin-top-left z-10 ${
              isInventoryOpen
                ? "scale-100 opacity-100 visible"
                : "scale-95 opacity-0 invisible"
            }`}>
            <div className="flex flex-col py-1">
              <Link
                to="/bird-inventory"
                onClick={() => handleLinkClick(setInventoryOpen)}
                className={`${dropdownLinkClass} rounded-t-xl`}>
                <Bird className="w-5 h-5 text-green-500" />
                Birds Inventory
              </Link>

              <Link
                to="/feed-inventory"
                onClick={() => handleLinkClick(setInventoryOpen)}
                className={`${dropdownLinkClass} rounded-b-xl`}>
                <Package className="w-5 h-5 text-yellow-500" />
                Feed Stock
              </Link>
            </div>
          </div>
        </div>

        {/* Reports Dropdown */}
        <div ref={reportRef} className="relative">
          <button
            onClick={() => {
              setReportOpen(!isReportOpen);
              setInventoryOpen(false); // Close other dropdown
            }}
            className={dropdownButtonClass}>
            Reports
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                isReportOpen ? "rotate-180 text-blue-600" : "rotate-0 text-gray-500"
              }`}
            />
          </button>
          <div
            className={`absolute left-0 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-gray-100
            transition-all duration-200 transform origin-top-left z-10 ${
              isReportOpen
                ? "scale-100 opacity-100 visible"
                : "scale-95 opacity-0 invisible"
            }`}>
            <div className="flex flex-col py-1">
              <Link
                to="/reports/daily-report"
                onClick={() => handleLinkClick(setReportOpen)}
                className={`${dropdownLinkClass} rounded-t-xl`}>
                <ListOrdered className="w-5 h-5 text-blue-500" />
                Daily Log Report
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
                className={`${dropdownLinkClass} rounded-b-xl`}>
                <Bird className="w-5 h-5 text-green-500" />
                Bird Count Report
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
