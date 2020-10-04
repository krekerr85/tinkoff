export const SERVER_ERROR_TYPE = 'serverError';

export async function fetchApi(url, args, method, readDataCallback) {
  const response = await fetch(url, {
    method,
    body: JSON.stringify(args),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  });

  if (readDataCallback) {
    if (response.status === 200)
      return readDataCallback(response);
    throw {
      type: SERVER_ERROR_TYPE,
      status: response.status
    };
  }
  return response;
}

export function fetchJson(url, args, method = 'Get') {
  return fetchApi(url, args, method, r => r.json());
}

export function fetchText(url, args, method = 'Get') {
  return fetchApi(url, args, method, r => r.text());
}
