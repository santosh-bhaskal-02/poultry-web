import { UPDATE_FEED_INVENTORY } from "@/constants/urls";
import makeRequest from "@/services/api/makeRequest";
import type { FeedInventoryFormData } from "@/types";
import { useMutation } from "@tanstack/react-query";

interface updateFeedInventoryProps {
  id: string | number;
  feedInventory: FeedInventoryFormData;
}

const updateFeedInventory = async ({ id, feedInventory }: updateFeedInventoryProps) => {
  const response = await makeRequest<updateFeedInventoryProps>({
    pathname: UPDATE_FEED_INVENTORY(id),
    method: "PUT",
    values: feedInventory,
  });
  return response;
};

const useUpdateFeedInventory = () => {
  return useMutation({
    mutationKey: ["update-feedInventory"],
    mutationFn: updateFeedInventory,
  });
};

export default useUpdateFeedInventory;
