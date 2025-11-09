import DashboardSummary from "./DashboardSummary";
import DailyReport from "@/components/Reports/DailyReport";
import { ClipboardList, Plus } from "lucide-react";
import { Button } from "../ui/button";
import AddDailyRecordModal from "../Common/Modal/AddDailyRecordModal";
import { useState } from "react";

const Dashboard = () => {
  const [isOpenModal, setOpenModal] = useState(false);
  return (
    <div className="flex flex-col gap-5 py-5 w-full max-w-6xl mx-auto">
      <DashboardSummary />

      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setOpenModal(true)}
          className="w-14 h-14 rounded-full shadow-2xl transition-transform duration-300 hover:scale-105 hover:shadow-lg focus:ring-blue-300">
          <Plus className="w-6 h-6" />
        </Button>
        <AddDailyRecordModal
          open={isOpenModal}
          onClose={() => setOpenModal(!isOpenModal)}
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <ClipboardList className="text-blue-600 w-5 h-5" />
          <h1 className="text-blue-600 font-semibold text-lg">Previous Records</h1>
        </div>
        <DailyReport />
      </div>
    </div>
  );
};

export default Dashboard;
