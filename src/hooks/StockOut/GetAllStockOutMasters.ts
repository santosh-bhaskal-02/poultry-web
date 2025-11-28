import { GET_ALL_STOCKOUT_MASTERS } from "@/constants/urls";
import makeRequest from "@/services/api/makeRequest";
import { useQuery } from "@tanstack/react-query";

const getAllStockOutMasters = async () => {
  const response = await makeRequest({
    method: "GET",
    pathname: GET_ALL_STOCKOUT_MASTERS,
  });

  return response;
};

const useGetAllStockOutMasters = () => {
  return useQuery({
    queryKey: ["get-all-stock-out-masters"],
    queryFn: () => getAllStockOutMasters(),
  });
};

export default useGetAllStockOutMasters;
