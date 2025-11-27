import { STOCKOUT_ADD_ENTRY } from "@/constants/urls";
import makeRequest from "@/services/api/makeRequest";
import type { BirdInventoryFormData } from "@/types";
import type { StockOutEntryFormData } from "@/types/stockOut";
import { useMutation } from "@tanstack/react-query";

// interface createStockOutEntryProps {
//   stockOutEntry: StockOutEntryFormData;
// }

const createStockOutEntry = async ({ stockOutEntry }) => {
  const response = await makeRequest({
    pathname: STOCKOUT_ADD_ENTRY,
    method: "POST",
    values: stockOutEntry,
  });
  return response;
};

const useCreateStockOutEntry = () => {
  return useMutation({
    mutationKey: ["create-stock-out-entry"],
    mutationFn: createStockOutEntry,
  });
};

export default useCreateStockOutEntry;
