import { GET_ALL_FEED_INVNETORY } from "@/constants/urls";
import makeRequest from "@/services/api/makeRequest";
import { useQuery } from "@tanstack/react-query";

const getAllFeedInventory = async () => {
  const response = await makeRequest({
    method: "GET",
    pathname: GET_ALL_FEED_INVNETORY,
  });

  return response;
};

const useGetAllFeedInventory = () => {
  return useQuery({
    queryKey: ["get-all-feedInventories"],
    queryFn: getAllFeedInventory,
  });
};

export default useGetAllFeedInventory;
