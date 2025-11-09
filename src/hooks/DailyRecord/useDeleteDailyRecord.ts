import { DELETE_DAILY_RECORD } from "@/constants/urls";
import makeRequest from "@/services/api/makeRequest";
import { useMutation } from "@tanstack/react-query";

interface deleteDailyRecordProps {
  id: string | number;
}

const deleteDailyRecord = async ({ id }: deleteDailyRecordProps) => {
  const response = await makeRequest<deleteDailyRecordProps>({
    pathname: DELETE_DAILY_RECORD(id),
    method: "PATCH",
  });
  return response;
};

const useDeleteDailyRecord = (id) => {
  return useMutation({
    mutationKey: ["create-dailyRecord", id],
    mutationFn: deleteDailyRecord,
  });
};

export default useDeleteDailyRecord;
