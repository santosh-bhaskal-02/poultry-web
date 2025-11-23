import { CREATE_BIRD_INVENTORY } from "@/constants/urls";
import makeRequest from "@/services/api/makeRequest";
import type { BirdInventoryFormData } from "@/types";
import { useMutation } from "@tanstack/react-query";

interface createStockOutEntryProps {
  stockOutEntry: BirdInventoryFormData;
}

const createStockOutEntry = async ({ stockOutEntry }: createStockOutEntryProps) => {
  const response = await makeRequest<BirdInventoryFormData>({
    pathname: CREATE_BIRD_INVENTORY,
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
