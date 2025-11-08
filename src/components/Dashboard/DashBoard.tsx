import DashboardSummary from "./DashboardSummary";
import DashboardForm from "./DashboardForm";
import DailyReport from "@/components/Reports/DailyReport";

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-10 sm:px-0 px-2 py-5">
      <DashboardSummary />
      <DashboardForm />

      <div className="flex flex-col gap-2">
        <h1 className="text-blue-500 font-semibold text-base">Previous Records:</h1>
        <DailyReport />
      </div>
    </div>
  );
};

export default Dashboard;
