type FetchConfig = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Object;
};

export const useFetch = async <T>(
  url: string,
  { method, body }: FetchConfig
): Promise<T> => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: method ?? 'GET',
      body: body ? JSON.stringify(body) : null,
    });
    const data = await response.json();
    return data as T;
  } catch (error) {
    console.log(error);
    return null as T;
  }
};
