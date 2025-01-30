const originalFetch = globalThis.fetch;

export async function fetchWithProxy(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  try {
    const response = await originalFetch(input, init);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`Request failed: ${response.statusText}`);
    }
    return response;
  } catch (error) {
    console.error('Request Error:', error);
    throw error;
  }
} 