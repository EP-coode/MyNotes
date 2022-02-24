import { request } from "../httpClient/client";

const tagsService = (apiUrl: string) => {
  async function getTags(acces_token: string): Promise<Map<String, Number>> {
    return request<Map<String, Number>, undefined>(
      "/tags",
      "GET",
      undefined,
      {
        Authorization: `Bearer ${acces_token}`,
      },
      apiUrl
    );
  }

  return {
    getTags,
  };
};

export default tagsService;
