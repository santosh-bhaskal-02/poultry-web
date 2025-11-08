import { GET_DASHBOARD } from "@/constants/urls";
import makeRequest from "@/services/api/makeRequest";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

const getDashboardSummary = async () => {
  const response = await makeRequest({
    method: "GET",
    pathname: GET_DASHBOARD,
  });

  return response;
};

const useGetDashboard = () => {
  return useQuery({
    queryKey: ["get-dashboard"],
    queryFn: () => getDashboardSummary(),
  });
};

export default useGetDashboard;
