import SummaryCard from "@/components/Common/cards/DashboardSummary";
import { Bird, Wheat, Skull, Warehouse } from "lucide-react";
import useGetDashboard from "@/hooks/Dashboard/useGetDashboard";
import Spinner from "@/components/Common/Spinner";

const DashboardSummary = () => {
  const { data: metrics, isPending } = useGetDashboard();

  const summaryData = [
    {
      title: "Mortality Count",
      value: metrics?.data?.totalMortality || 0,
      color: "bg-gradient-to-br from-pink-500 to-red-600",
      icon: <Skull className="h-7 w-7 text-white" />,
    },
    {
      title: "Alive Birds",
      value: metrics?.data?.totalAliveBirds || 0,
      color: "bg-gradient-to-br from-green-500 to-teal-600",
      icon: <Bird className="h-7 w-7 text-white" />,
    },
    {
      title: "Feed Consumed (Bags)",
      value: metrics?.data?.totalFeedConsume || 0,
      color: "bg-gradient-to-br from-amber-400 to-yellow-600",
      icon: <Wheat className="h-7 w-7 text-white" />,
    },
    {
      title: "Feed Available (Bags)",
      value: metrics?.data?.totalFeedBagsAvailable || 0,
      color: "bg-gradient-to-br from-indigo-500 to-blue-700",
      icon: <Warehouse className="h-7 w-7 text-white" />,
    },
  ];

  return (
    <>
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryData.map((item, i) => (
          <SummaryCard
            key={i}
            title={item.title}
            value={item.value}
            color={item.color}
            icon={item.icon}
          />
        ))}
      </section>
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-2xl z-50">
          <Spinner />
        </div>
      )}
    </>
  );
};

export default DashboardSummary;
