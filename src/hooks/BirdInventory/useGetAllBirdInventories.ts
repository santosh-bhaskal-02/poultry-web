import { GET_ALL_BIRD_INVNETORY } from "@/constants/urls";
import makeRequest from "@/services/api/makeRequest";
import { useQuery } from "@tanstack/react-query";

const getAllBirdInventories = async () => {
  const response = await makeRequest({
    method: "GET",
    pathname: GET_ALL_BIRD_INVNETORY,
  });

  return response;
};

const useGetAllBirdInventories = () => {
  return useQuery({
    queryKey: ["get-all-birdInventories"],
    queryFn: getAllBirdInventories,
  });
};

export default useGetAllBirdInventories;
