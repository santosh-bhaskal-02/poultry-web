import { GET_ALL_FINAL_REPORT } from "@/constants/urls";
import makeRequest from "@/services/api/makeRequest";
import { useQuery } from "@tanstack/react-query";

const getAllFinalReports = async () => {
  const response = await makeRequest({
    method: "GET",
    pathname: GET_ALL_FINAL_REPORT,
  });

  return response;
};

const useGetAllFinalReports = () => {
  return useQuery({
    queryKey: ["get-all-final-reports"],
    queryFn: getAllFinalReports,
  });
};

export default useGetAllFinalReports;
