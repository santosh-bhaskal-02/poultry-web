import { useEffect, useState } from "react";
import axios from "axios";
import SummaryCard from "@/components/Common/cards/DashboardSummary";
import type { DashboardMetrics } from "@/types";
import { BarChart3, HeartPulse, Wheat, CheckCircle } from "lucide-react"; // example icons
import useGetDashboard from "@/hooks/Dashboard/useGetDashboard";

const DashboardSummary = () => {
  // const BASE_URL = import.meta.env.VITE_API_URL;

  // const [metrics, setMetrics] = useState<DashboardMetrics>({
  //   totalMortality: 0,
  //   totalAliveBirds: 0,
  //   totalFeedConsume: 0,
  //   totalFeedBagsAvailable: 0,
  // });

  const { data: metrics, isPending } = useGetDashboard();

  // const fetchDashboardMetrics = async () => {
  //   try {
  //     const response = await axios.get(`${BASE_URL}/api/dashboard`);
  //     console.log("respons11e dashboard", response.data.data);
  //     setMetrics(response.data.data);
  //   } catch (error) {
  //     console.error("Error fetching dashboard metrics:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchDashboardMetrics();
  // }, []);

  return (
    <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <SummaryCard
        title="Mortality Count"
        value={metrics?.data?.totalMortality}
        color="bg-red-500"
        icon={<HeartPulse className="h-6 w-6" />}
      />
      <SummaryCard
        title="Alive Birds"
        value={metrics?.data?.totalAliveBirds}
        color="bg-green-500"
        icon={<CheckCircle className="h-6 w-6" />}
      />
      <SummaryCard
        title="Feed Consumed (Bags)"
        value={metrics?.data?.totalFeedConsume}
        color="bg-orange-400"
        icon={<Wheat className="h-6 w-6" />}
      />
      <SummaryCard
        title="Feed Available (Bags)"
        value={metrics?.data?.totalFeedBagsAvailable}
        color="bg-blue-500"
        icon={<BarChart3 className="h-6 w-6" />}
      />
    </section>
  );
};

export default DashboardSummary;
