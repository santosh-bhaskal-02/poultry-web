import { Link, useLocation } from "react-router-dom";
import { Home, Bird, Wheat, BarChart3, Plus } from "lucide-react";
import AddDailyRecordModal from "@/components/Common/Modal/AddDailyRecordModal";
import { useState } from "react";

const BottomNavBar = () => {
  const location = useLocation();
  const [openModal, setOpenModal] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { to: "/", label: "Home", icon: <Home className="w-6 h-6" /> },
    { to: "/inventories", label: "Inventories", icon: <Bird className="w-6 h-6" /> },
    { to: "/stock-out", label: "Stock out", icon: <BarChart3 className="w-6 h-6" /> },
    {
      to: "/report",
      label: "Reports",
      icon: <BarChart3 className="w-6 h-6" />,
    },
  ];

  return (
    <>
      {/* Add Modal */}
      <AddDailyRecordModal open={openModal} onClose={() => setOpenModal(false)} />

      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t border-gray-200 sm:hidden">
        {/* Curve Background */}
        <div className="relative w-full h-16 flex items-center justify-between px-6">
          {/* Home */}
          <Link to={navItems[0].to} className="flex flex-col items-center">
            <div
              className={`
              w-10 h-10 flex items-center justify-center rounded-xl
              ${
                isActive(navItems[0].to)
                  ? "text-emerald-700 bg-emerald-100"
                  : "text-gray-500"
              }
            `}>
              {navItems[0].icon}
            </div>
            <span className="text-[11px]">{navItems[0].label}</span>
          </Link>

          {/* Birds */}
          <Link to={navItems[1].to} className="flex flex-col items-center">
            <div
              className={`
              w-10 h-10 flex items-center justify-center rounded-xl
              ${
                isActive(navItems[1].to)
                  ? "text-emerald-700 bg-emerald-100"
                  : "text-gray-500"
              }
            `}>
              {navItems[1].icon}
            </div>
            <span className="text-[11px]">{navItems[1].label}</span>
          </Link>

          {/* Center NOTCH */}
          <div className="absolute -top-7 left-1/2 -translate-x-1/2">
            <button
              onClick={() => setOpenModal(true)}
              className="
                w-16 h-16 rounded-full bg-emerald-600 text-white
                shadow-2xl flex items-center justify-center
                hover:bg-emerald-700 active:scale-95
                transition-all duration-200
                border-[6px] border-white
              ">
              <Plus className="w-10 h-10" />
            </button>
          </div>

          <Link to={navItems[2].to} className="flex flex-col items-center">
            <div
              className={`
              w-10 h-10 flex items-center justify-center rounded-xl
              ${
                isActive(navItems[2].to)
                  ? "text-emerald-700 bg-emerald-100"
                  : "text-gray-500"
              }
            `}>
              {navItems[2].icon}
            </div>
            <span className="text-[11px]">{navItems[2].label}</span>
          </Link>

          {/* Reports */}
          <Link to={navItems[3].to} className="flex flex-col items-center">
            <div
              className={`
              w-10 h-10 flex items-center justify-center rounded-xl
              ${
                isActive(navItems[3].to)
                  ? "text-emerald-700 bg-emerald-100"
                  : "text-gray-500"
              }
            `}>
              {navItems[3].icon}
            </div>
            <span className="text-[11px]">{navItems[3].label}</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default BottomNavBar;
