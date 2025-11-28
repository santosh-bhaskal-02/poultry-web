import { GET_STOCKOUT_MASTER_BY_ID } from "@/constants/urls";
import makeRequest from "@/services/api/makeRequest";
import { useQuery } from "@tanstack/react-query";

const getStockOutById = async ({ masterId }) => {
  const response = await makeRequest({
    method: "GET",
    pathname: GET_STOCKOUT_MASTER_BY_ID(masterId),
  });

  return response;
};

const useGetStockOutById = ({ masterId }) => {
  return useQuery({
    queryKey: ["get-all-stock-out-by-id", masterId],
    queryFn: () => getStockOutById({ masterId }),
  });
};

export default useGetStockOutById;
