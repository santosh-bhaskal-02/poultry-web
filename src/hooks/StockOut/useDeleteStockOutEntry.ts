import { STOCKOUT_ADD_ENTRY, STOCKOUT_DELETE_ENTRY } from "@/constants/urls";
import makeRequest from "@/services/api/makeRequest";
import type { BirdInventoryFormData } from "@/types";
import type { StockOutEntryFormData } from "@/types/stockOut";
import { useMutation } from "@tanstack/react-query";

// interface createStockOutEntryProps {
//   stockOutEntry: StockOutEntryFormData;
// }

const deleteStockOutEntry = async ({ id }) => {
  const response = await makeRequest({
    pathname: STOCKOUT_DELETE_ENTRY(id),
    method: "DELETE",
  });
  return response;
};

const useDeleteStockOutEntry = () => {
  return useMutation({
    mutationKey: ["delete-stock-out-entry"],
    mutationFn: deleteStockOutEntry,
  });
};

export default useDeleteStockOutEntry;
