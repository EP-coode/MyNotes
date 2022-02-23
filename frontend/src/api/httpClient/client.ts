export type httpClient = () => 



const getHttpClient = async (apiUrl: string) => async <T, B>(
    endpoint: string,
    method: "GET" | "POST" | "PATCH" | "DELETE",
    body: B | undefined,
    headers = {}
  ): Promise<T | any> => {
    try {
      const result = await fetch(`${apiUrl}${endpoint}`, {
        method: method,
        body: typeof body === "object" ? JSON.stringify(body) : undefined,
        mode: "cors",
        headers: {
          "Content-type": "application/json",
          ...headers,
        },
      });

      if (!result.ok) {
        return { error: "jakiś błąd" };
      }

      return await result.json();
    } catch (err) {
      return { error: err };
    }
  };

export default getHttpClient;
