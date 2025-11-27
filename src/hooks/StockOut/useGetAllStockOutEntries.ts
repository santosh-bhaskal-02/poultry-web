import { STOCKOUT_GET_ENTRIES } from "@/constants/urls";
import makeRequest from "@/services/api/makeRequest";
import { useQuery } from "@tanstack/react-query";

const getAllStockOutEntries = async ({ masterId }) => {
  const response = await makeRequest({
    method: "GET",
    pathname: STOCKOUT_GET_ENTRIES(masterId),
  });

  return response;
};

const useGetAllStockOutEntries = ({ masterId }) => {
  return useQuery({
    queryKey: ["get-all-stock-out-entries", masterId],
    queryFn: () => getAllStockOutEntries({ masterId }),
  });
};

export default useGetAllStockOutEntries;
