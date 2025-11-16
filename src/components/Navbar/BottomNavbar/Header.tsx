import { useLocation } from "react-router-dom";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/bird-inventory": "Bird Inventory",
  "/feed-inventory": "Feed Inventory",
  "/daily-record": "Daily Records",
  "/bird-inventory-list": "Birds Overview",
  "/feed-inventory-list": "Feed Overview",
  "/reports": "Reports",
};

const Header = () => {
  const { pathname } = useLocation();

  const title = pageTitles[pathname] || "Poultry Management";

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-40">
      <div className="px-4 py-3">
        <h1 className="text-xl font-bold text-slate-800">{title}</h1>
      </div>
    </header>
  );
};

export default Header;
