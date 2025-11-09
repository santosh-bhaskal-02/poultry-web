import { UPDATE_DAILY_RECORD } from "@/constants/urls";
import makeRequest from "@/services/api/makeRequest";
import type { DailyRecordFormData } from "@/types";
import { useMutation } from "@tanstack/react-query";

interface updateDailyRecordProps {
  id: string | number;
  dailyRecord: DailyRecordFormData;
}

const updateDailyRecord = async ({ id, dailyRecord }: updateDailyRecordProps) => {
  const response = await makeRequest<updateDailyRecordProps>({
    pathname: UPDATE_DAILY_RECORD(id),
    method: "PUT",
    values: dailyRecord,
  });
  return response;
};

const useUpdateDailyRecord = () => {
  return useMutation({
    mutationKey: ["update-dailyRecord"],
    mutationFn: updateDailyRecord,
  });
};

export default useUpdateDailyRecord;
