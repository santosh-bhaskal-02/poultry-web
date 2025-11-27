import { STOCKOUT_CREATE_MASTER } from "@/constants/urls";
import makeRequest from "@/services/api/makeRequest";
import type { BirdInventoryFormData } from "@/types";
import type { StockOutMasterFormData } from "@/types/stockOut";
import { useMutation } from "@tanstack/react-query";

// interface createStockOutProps {
//   stockOut: StockOutMasterFormData;
// }

const createStockOut = async () => {
  const response = await makeRequest({
    pathname: STOCKOUT_CREATE_MASTER,
    method: "POST",
  });
  return response;
};

const useCreateStockOut = () => {
  return useMutation({
    mutationKey: ["create-stock-out"],
    mutationFn: createStockOut,
  });
};

export default useCreateStockOut;
