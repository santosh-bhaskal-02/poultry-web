import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Bird, PlusCircle, Warehouse, ClipboardList, Package } from "lucide-react";

import BirdsInventoryReport from "../Records/InventoryReport/BirdInventory";
import { FeedInventoryReport, StockOutReport } from "../Records";

const StockOut = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-8 mb-20 px-1 ">
      {/* HEADER */}
      <div className="flex items-center gap-3 p-2 mb-1">
        <Bird className="w-10 h-10 text-emerald-600" />
        <h1 className="text-3xl font-extrabold text-emerald-700">Stock Out</h1>
      </div>

      {/* ACTION SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Add Birds */}
        <div className="p-5 mx-2 rounded-xl bg-emerald-50 border border-emerald-200 shadow hover:shadow-md transition">
          <div className="flex items-center gap-3 mb-2">
            <PlusCircle className="w-7 h-7 text-emerald-700" />
            <h2 className="text-lg font-bold text-emerald-700">Add Stock Out</h2>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            Record bird arrival information such as boxes, birds per box, mortality, and
            housed birds.
          </p>

          <Button
            onClick={() => navigate("/stock-out/add")}
            className="bg-emerald-600 text-white hover:bg-emerald-700 w-full">
            Add Stock Out
          </Button>
        </div>
      </div>

      {/* REPORT: BIRDS */}
      <div className="mt-1">
        <div className="flex items-center gap-2 mb-2 px-2">
          <Bird className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-bold text-emerald-800">Stock Out Report</h3>
        </div>

        <div className="w-full ">
          <StockOutReport />
        </div>
      </div>
    </div>
  );
};

export default StockOut;
