import { CREATE_DAILY_RECORD, UPDATE_DAILY_RECORD } from "@/constants/urls";
import makeRequest from "@/services/api/makeRequest";
import type { DailyRecordFormData } from "@/types";
import { useMutation } from "@tanstack/react-query";

interface updateDailyRecordProps {
  dailyRecord: DailyRecordFormData;
}

const createDailyRecord = async ({ id, dailyRecord }: updateDailyRecordProps) => {
  const response = await makeRequest<DailyRecordFormData>({
    pathname: UPDATE_DAILY_RECORD(id),
    method: "PATCH",
    values: dailyRecord,
  });
  return response;
};

const useCreateDailyRecord = () => {
  return useMutation({
    mutationKey: ["create-dailyRecord"],
    mutationFn: createDailyRecord,
  });
};

export default useCreateDailyRecord;
