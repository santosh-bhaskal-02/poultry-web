import { GET_ALL_DAILY_RECORD } from "@/constants/urls";
import makeRequest from "@/services/api/makeRequest";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

const getAllDailyRecord = async () => {
  const response = await makeRequest({
    method: "GET",
    pathname: GET_ALL_DAILY_RECORD,
  });

  return response;
};

const useGetAllDailyRecord = () => {
  return useQuery({
    queryKey: ["get-all-dailyRecord"],
    queryFn: () => getAllDailyRecord(),
  });
};

export default useGetAllDailyRecord;
