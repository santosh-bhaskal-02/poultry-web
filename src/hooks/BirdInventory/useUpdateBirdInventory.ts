import { UPDATE_BIRD_INVENTORY } from "@/constants/urls";
import makeRequest from "@/services/api/makeRequest";
import type { BirdInventoryFormData } from "@/types";
import { useMutation } from "@tanstack/react-query";

interface updateBirdInventoryProps {
  id: string | number;
  birdInventory: BirdInventoryFormData;
}

const updateBirdInventory = async ({ id, birdInventory }: updateBirdInventoryProps) => {
  const response = await makeRequest<updateBirdInventoryProps>({
    pathname: UPDATE_BIRD_INVENTORY(id),
    method: "PUT",
    values: birdInventory,
  });
  return response;
};

const useUpdateBirdInventory = () => {
  return useMutation({
    mutationKey: ["update-dailyRecord"],
    mutationFn: updateBirdInventory,
  });
};

export default useUpdateBirdInventory;
