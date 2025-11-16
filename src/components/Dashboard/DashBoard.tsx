import DashboardSummary from "./DashboardSummary";
import DailyReport from "@/components/Reports/DailyReport";
import { ClipboardList, Sunrise, Feather, LineChart } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="w-full mx-auto max-w-6xl px-1 py-2 mb-20 flex flex-col gap-6">
      {/* TOP GREETING SECTION */}
      <div className="bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-300 rounded-2xl p-5 px-2 shadow-md flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Sunrise className="w-6 h-6 text-orange-700" />
            Good Morning!
          </h1>
          <p className="text-slate-700 text-sm mt-1">
            Here’s your farm overview for today 🌿
          </p>
        </div>

        <div className="hidden sm:block">
          <Feather className="w-10 h-10 text-orange-700 opacity-70" />
        </div>
      </div>

      {/* DASHBOARD SUMMARY */}
      <DashboardSummary />

      {/* PREVIOUS RECORDS HEADER */}
      <div className="flex items-center gap-2 mt-4">
        <LineChart className="text-blue-600 w-5 h-5" />
        <h1 className="text-lg font-semibold text-blue-700">Recent Daily Records</h1>
      </div>

      {/* DAILY REPORT LIST */}
      <div className=" rounded-xl  ">
        <DailyReport />
      </div>
    </div>
  );
};

export default Dashboard;
