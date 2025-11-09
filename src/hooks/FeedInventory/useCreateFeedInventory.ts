import { CREATE_FEED_INVENTORY } from "@/constants/urls";
import makeRequest from "@/services/api/makeRequest";
import type { FeedInventoryFormData } from "@/types";
import { useMutation } from "@tanstack/react-query";

interface createFeedInventoryProps {
  feedInventory: FeedInventoryFormData;
}

const createFeedInventory = async ({ feedInventory }: createFeedInventoryProps) => {
  const response = await makeRequest<FeedInventoryFormData>({
    pathname: CREATE_FEED_INVENTORY,
    method: "POST",
    values: feedInventory,
  });
  return response;
};

const useCreateFeedInventory = () => {
  return useMutation({
    mutationKey: ["create-feedInventory"],
    mutationFn: createFeedInventory,
  });
};

export default useCreateFeedInventory;
