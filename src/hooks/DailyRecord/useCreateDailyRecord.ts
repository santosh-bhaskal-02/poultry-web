import { CREATE_DAILY_RECORD } from "@/constants/urls";
import makeRequest from "@/services/api/makeRequest";
import type { DailyRecordFormData } from "@/types";
import { useMutation } from "@tanstack/react-query";

interface createDailyRecordProps {
  dailyRecord: createDailyRecordProps;
}

const createDailyRecord = async ({ dailyRecord }: createDailyRecordProps) => {
  const response = await makeRequest<DailyRecordFormData>({
    pathname: CREATE_DAILY_RECORD,
    method: "POST",
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
