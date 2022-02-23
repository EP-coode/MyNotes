import client from "../client";

export default async function getTags(
  acces_token: string
): Promise<Map<String, Number>> {
  return client<Map<String, Number>, undefined>("/tags", "GET", undefined, {
    'Authorization': `Bearer ${acces_token}`,
  });
}
