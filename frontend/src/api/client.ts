const API_URL = "127.0.0.1";

export default async function client<T, B>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body: B | undefined,
  headers: {},
  apiUrl = API_URL
): Promise<T | any> {
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
}
