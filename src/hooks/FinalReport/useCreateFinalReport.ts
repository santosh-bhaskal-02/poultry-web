import { CREATE_FINAL_REPORT } from "@/constants/urls";
import makeRequest from "@/services/api/makeRequest";
import type { FeedInventoryFormData } from "@/types";
import { useMutation } from "@tanstack/react-query";

interface createFinalReportProps {
  finalReport: FinalReportFormValues;
}

const createFinalReport = async ({ finalReport }: createFinalReportProps) => {
  const response = await makeRequest<FeedInventoryFormData>({
    pathname: CREATE_FINAL_REPORT,
    method: "POST",
    values: finalReport,
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
