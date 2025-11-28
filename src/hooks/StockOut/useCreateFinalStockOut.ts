import { STOCKOUT_FINALIZE_MASTER } from "@/constants/urls";
import makeRequest from "@/services/api/makeRequest";
import type { StockOutMasterFormData } from "@/types/stockOut";
import { useMutation } from "@tanstack/react-query";

interface createFinalStockOutProps {
  id: number;
  finalStockOut: StockOutMasterFormData;
}

const createFinalStockOut = async ({ id, finalStockOut }: createFinalStockOutProps) => {
  const response = await makeRequest({
    pathname: STOCKOUT_FINALIZE_MASTER(id),
    method: "PUT",
    values: finalStockOut,
  });
  return response;
};

const useCreateFinalStockOut = () => {
  return useMutation({
    mutationKey: ["create-final-stock-out"],
    mutationFn: createFinalStockOut,
  });
};

export default useCreateFinalStockOut;
