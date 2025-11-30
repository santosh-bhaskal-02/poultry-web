import { UPDATE_FINAL_REPORT } from "@/constants/urls";
import makeRequest from "@/services/api/makeRequest";
import type { StockOutEntryFormData } from "@/types/stockOut";
import { useMutation } from "@tanstack/react-query";

interface updateFinalReportProps {
  id: number;
  stockOutEntry: StockOutEntryFormData;
}

const updateFinalReport = async ({ id, updatedReport }: updateFinalReportProps) => {
  const response = await makeRequest({
    pathname: UPDATE_FINAL_REPORT(id),
    method: "PUT",
    values: updatedReport,
  });
  return response;
};

const useUpdateFinalReport = () => {
  return useMutation({
    mutationKey: ["update-final-report"],
    mutationFn: updateFinalReport,
  });
};

export default useUpdateFinalReport;
