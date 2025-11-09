import { DELETE_FEED_INVENTORY } from "@/constants/urls";
import makeRequest from "@/services/api/makeRequest";
import { useMutation } from "@tanstack/react-query";

interface deleteFeedInventoryProps {
  id: string | number;
}

const deleteFeedInventory = async ({ id }: deleteFeedInventoryProps) => {
  const response = await makeRequest<deleteFeedInventoryProps>({
    pathname: DELETE_FEED_INVENTORY(id),
    method: "PATCH",
  });
  return response;
};

const useDeleteFeedInventory = (id) => {
  return useMutation({
    mutationKey: ["delete-feedInventory", id],
    mutationFn: deleteFeedInventory,
  });
};

export default useDeleteFeedInventory;
