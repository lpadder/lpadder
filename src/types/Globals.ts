export interface SuccessResponse<T> {
  success: true;
  data: T;
}

export interface FailResponse {
  success: false;
  message: string;
  debug?: unknown;
}

export type Response<T> = Promise<SuccessResponse<T> | FailResponse>;