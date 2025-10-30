import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const Navbar = () => {
  const [isReportOpen, setReportOpen] = useState(false);
  const [isInventoryOpen, setInventoryOpen] = useState(false);

  console.log("isReportOpen", isReportOpen);

  return (
    <div className="shadow-2xs pb-1">
      <div className="text-4xl p-4 pb-2 bg-white">
        <h1 className="text-blue-500 text-3xl font-bold">Daily Poultry</h1>
      </div>

      <div className="flex flex-row items-start px-3">
        <Link
          to="/"
          className="text-base font-semibold px-3 py-1 rounded-2xl  hover:bg-gray-300 hover:text-gray-700">
          Daily Report
        </Link>

        {/* <Link
          to="/bird-inventory"
          className="text-base font-semibold px-3 py-1 rounded-2xl  hover:bg-gray-300 hover:text-gray-700">
          Birds Inventory
        </Link>

        <Link
          to="/feed-inventory"
          className="text-base font-semibold px-3 py-1 rounded-2xl  hover:bg-gray-300 hover:text-gray-700">
          Feed Inventory
        </Link> */}

        <div className="relative group">
          <button
            onClick={() => setInventoryOpen(!isInventoryOpen)}
            className="flex items-center gap-2 text-base font-semibold px-3 py-1 
        rounded-full  text-gray-800 hover:bg-gray-300 hover:text-gray-700 
        transition-all duration-300 ">
            Inventory
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                isInventoryOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          <div
            className={`absolute right-0 mt-4 w-48 bg-white rounded-2xl shadow-2xl 
        transition-all duration-300 origin-top ${
          isInventoryOpen
            ? "scale-100 opacity-100 visible"
            : "scale-95 opacity-0 invisible"
        }`}>
            <div className="flex flex-col text-gray-700">
              <Link
                to="/bird-inventory"
                className="px-4 py-2 hover:bg-blue-50 hover:text-blue-600 rounded-t-2xl transition">
                Birds Inventory
              </Link>

              <Link
                to="/feed-inventory"
                className="px-4 py-2 hover:bg-blue-50 hover:text-blue-600 rounded-t-2xl transition">
                Feed Inventory
              </Link>
            </div>
          </div>
        </div>

        <div className="relative group">
          <button
            onClick={() => setReportOpen(!isReportOpen)}
            className="flex items-center gap-2 text-base font-semibold px-3 py-1 
        rounded-full  text-gray-800 hover:bg-gray-300 hover:text-gray-700 
        transition-all duration-300 ">
            Reports
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                isReportOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
          <div
            className={`absolute right-0 mt-4 w-48 bg-white rounded-2xl shadow-2xl 
        transition-all duration-300 origin-top ${
          isReportOpen ? "scale-100 opacity-100 visible" : "scale-95 opacity-0 invisible"
        }`}>
            <div className="flex flex-col text-gray-700">
              <Link
                to="/reports/daily-report"
                className="px-4 py-2 hover:bg-blue-50 hover:text-blue-600 rounded-t-2xl transition">
                Daily Report
              </Link>

              <Link
                to="/reports/feedInventory-report"
                className="px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition">
                Feed Report
              </Link>

              <Link
                to="/reports/birdsInventory-report"
                className="px-4 py-2 hover:bg-blue-50 hover:text-blue-600 rounded-b-2xl transition">
                Inventory Report
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
