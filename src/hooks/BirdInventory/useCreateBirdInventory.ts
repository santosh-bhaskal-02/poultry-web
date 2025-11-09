import { CREATE_BIRD_INVENTORY } from "@/constants/urls";
import makeRequest from "@/services/api/makeRequest";
import type { BirdInventoryFormData } from "@/types";
import { useMutation } from "@tanstack/react-query";

interface createBirdInventoryProps {
  birdInventory: BirdInventoryFormData;
}

const createBirdInventory = async ({ birdInventory }: createBirdInventoryProps) => {
  const response = await makeRequest<BirdInventoryFormData>({
    pathname: CREATE_BIRD_INVENTORY,
    method: "POST",
    values: birdInventory,
  });
  return response;
};

const useCreateBirdInventory = () => {
  return useMutation({
    mutationKey: ["create-birdInventory"],
    mutationFn: createBirdInventory,
  });
};

export default useCreateBirdInventory;
