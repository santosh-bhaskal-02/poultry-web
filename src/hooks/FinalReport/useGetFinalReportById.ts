import { GET_FINAL_REPORT_BY_ID } from "@/constants/urls";
import makeRequest from "@/services/api/makeRequest";
import { useQuery } from "@tanstack/react-query";

const getFinalReportById = async (id) => {
  const response = await makeRequest({
    method: "GET",
    pathname: GET_FINAL_REPORT_BY_ID(id),
  });

  return response;
};

const useGetFinalReportById = (id) => {
  return useQuery({
    queryKey: ["get-final-report-by-id", id],
    queryFn: () => getFinalReportById(id),
    enabled: !!id,
  });
};

export default useGetFinalReportById;
