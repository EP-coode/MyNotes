import { request } from "../httpClient/client";

export async function getTags(
  acces_token: string
): Promise<Map<String, Number>> {
  return request<Map<String, Number>, undefined>("/tags", "GET", undefined, {
    Authorization: `Bearer ${acces_token}`,
  });
}
