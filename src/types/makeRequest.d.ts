export interface MakeRequestParams {
  pathname: string;
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  values?: any;
  params?: Record<string, any>;
  token?: boolean;
}

export interface ApiResponse<T> {
  status: string;
  code: number;
  success: boolean;
  message?: string;
  error?: { isOperational: boolean; status: string; statusCode: number };
  data?: T;
  summary?: any;
  pagination?: any;
}
