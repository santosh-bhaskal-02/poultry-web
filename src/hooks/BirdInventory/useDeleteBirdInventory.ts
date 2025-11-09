import { DELETE_BIRD_INVENTORY } from "@/constants/urls";
import makeRequest from "@/services/api/makeRequest";
import { useMutation } from "@tanstack/react-query";

interface deleteBirdInventoryProps {
  id: string | number;
}

const deleteBirdInventory = async ({ id }: deleteBirdInventoryProps) => {
  const response = await makeRequest<deleteBirdInventoryProps>({
    pathname: DELETE_BIRD_INVENTORY(id),
    method: "PATCH",
  });
  return response;
};

const useDeleteBirdInventory = (id: number | string) => {
  return useMutation({
    mutationKey: ["delete-birdInventory", id],
    mutationFn: deleteBirdInventory,
  });
};

export default useDeleteBirdInventory;
