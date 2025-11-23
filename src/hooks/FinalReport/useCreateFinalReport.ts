import { CREATE_FEED_INVENTORY } from "@/constants/urls";
import makeRequest from "@/services/api/makeRequest";
import type { FeedInventoryFormData } from "@/types";
import { useMutation } from "@tanstack/react-query";

interface createFinalReportProps {
  feedInventory: FeedInventoryFormData;
}

const createFinalReport = async ({ feedInventory }: createFinalReportProps) => {
  const response = await makeRequest<FeedInventoryFormData>({
    pathname: CREATE_FEED_INVENTORY,
    method: "POST",
    values: feedInventory,
  });
  return response;
};

const useCreateFinalReport = () => {
  return useMutation({
    mutationKey: ["create-final-report"],
    mutationFn: createFinalReport,
  });
};

export default useCreateFinalReport;
