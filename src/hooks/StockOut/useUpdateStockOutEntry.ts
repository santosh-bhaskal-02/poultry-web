import { STOCKOUT_UPDATE_ENTRY } from "@/constants/urls";
import makeRequest from "@/services/api/makeRequest";
import type { StockOutEntryFormData } from "@/types/stockOut";
import { useMutation } from "@tanstack/react-query";

interface updateStockOutEntryProps {
  id: number;
  stockOutEntry: StockOutEntryFormData;
}

const updateStockOutEntry = async ({ id, stockOutEntry }: updateStockOutEntryProps) => {
  const response = await makeRequest({
    pathname: STOCKOUT_UPDATE_ENTRY(id),
    method: "PUT",
    values: stockOutEntry,
  });
  return response;
};

const useUpdateStockOutEntry = () => {
  return useMutation({
    mutationKey: ["update-stock-out-entry"],
    mutationFn: updateStockOutEntry,
  });
};

export default useUpdateStockOutEntry;
