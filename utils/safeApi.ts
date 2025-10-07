import {AxiosResponse} from "axios";

export async function safeApi<T>(
  promise: Promise<AxiosResponse<T>>
): Promise<[T | null, string | null]> {
  try {
    const response = await promise;
    return [response.data, null];
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again.";
    return [null, message];
  }
}
