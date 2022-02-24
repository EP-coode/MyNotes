import { ErrorResponse } from "../Features/Common/interfaces/errorResponse";

const API_URL = "127.0.0.1:7000";

export const request = async <T, B>(
  endpoint: string,
  method: "GET" | "POST" | "PATCH" | "DELETE",
  body: B | undefined,
  headers = {},
  apiUrl = API_URL
): Promise<[T | ErrorResponse, boolean]> => {
  const result = await fetch(`${apiUrl}${endpoint}`, {
    method: method,
    body: typeof body === "object" ? JSON.stringify(body) : undefined,
    mode: "cors",
    headers: {
      "Content-type": "application/json",
      ...headers,
    },
  });

  const data = await result.json();
  return [data, result.ok];
};
