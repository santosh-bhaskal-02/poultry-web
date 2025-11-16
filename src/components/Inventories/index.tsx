import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Bird, PlusCircle, Warehouse, ClipboardList, Package } from "lucide-react";

import BirdsInventoryReport from "../Reports/InventoryReport/BirdInventory";
import { FeedInventoryReport } from "../Reports";

const Inventory = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-8 mb-20 px-1 ">
      {/* HEADER */}
      <div className="flex items-center gap-3 p-2 mb-1">
        <Bird className="w-10 h-10 text-emerald-600" />
        <h1 className="text-3xl font-extrabold text-emerald-700">Inventories</h1>
      </div>

      {/* ACTION SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Add Birds */}
        <div className="p-5 mx-2 rounded-xl bg-emerald-50 border border-emerald-200 shadow hover:shadow-md transition">
          <div className="flex items-center gap-3 mb-2">
            <PlusCircle className="w-7 h-7 text-emerald-700" />
            <h2 className="text-lg font-bold text-emerald-700">Add Birds Arrival</h2>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            Record bird arrival information such as boxes, birds per box, mortality, and
            housed birds.
          </p>

          <Button
            onClick={() => navigate("/bird-inventory")}
            className="bg-emerald-600 text-white hover:bg-emerald-700 w-full">
            Add Bird Inventory
          </Button>
        </div>

        {/* Add Feed */}
        <div className="p-5 mx-2 rounded-xl bg-yellow-50 border border-yellow-200 shadow hover:shadow-md transition">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-7 h-7 text-yellow-700" />
            <h2 className="text-lg font-bold text-yellow-700">Add Feed Entry</h2>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            Add daily feed arrivals including feed type, bag count, and driver details.
          </p>

          <Button
            onClick={() => navigate("/feed-inventory")}
            className="bg-yellow-500 text-white hover:bg-yellow-600 w-full">
            Add Feed Inventory
          </Button>
        </div>
      </div>

      {/* REPORTS SECTION */}
      <div className="flex items-center gap-3 px-2 mt-6">
        <ClipboardList className="w-6 h-6 text-slate-700" />
        <h2 className="text-2xl font-semibold text-slate-800">Batch Reports</h2>
      </div>

      {/* REPORT: BIRDS */}
      <div className="mt-1">
        <div className="flex items-center gap-2 mb-2 px-2">
          <Bird className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-bold text-emerald-800">Bird Arrival Report</h3>
        </div>

        <div className="w-full ">
          <BirdsInventoryReport />
        </div>
      </div>

      {/* REPORT: FEED */}
      <div>
        <div className="flex items-center gap-2 mb-2 px-3">
          <Warehouse className="w-5 h-5 text-yellow-600" />
          <h3 className="text-lg font-bold text-yellow-800 ">Feed Inventory Report</h3>
        </div>

        <div className="w-full ">
          <FeedInventoryReport />
        </div>
      </div>
    </div>
  );
};

export default Inventory;
