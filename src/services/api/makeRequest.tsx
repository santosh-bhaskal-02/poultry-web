import type { ApiResponse, MakeRequestParams } from "@/types/makeRequest";
import { HEADER_WITH_JSON_AND_TOKEN, HERDER_WITH_JSON } from "@/utils/headers";
import axios, { type AxiosRequestConfig } from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:7041";

const makeRequest = async <T,>({
  pathname,
  method,
  values,
  params,
  token,
}: MakeRequestParams): Promise<ApiResponse<T> | undefined> => {
  try {
    const response = await axios({
      method,
      url: `${BASE_URL}/${pathname}`,
      headers: token ? HEADER_WITH_JSON_AND_TOKEN : HERDER_WITH_JSON,
      params,
      data: values,
    } as AxiosRequestConfig);

    return { ...response.data };
  } catch (error) {
    console.log(error);
  }
};
export default makeRequest;
