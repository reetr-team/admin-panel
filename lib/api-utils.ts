const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API;

export async function apiGet(endpoint: string, accessToken: string) {
  const response = await fetch(`${BACKEND_API}${endpoint}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  
  return response.json();
}

export async function apiPost(endpoint: string, accessToken: string, body?: any) {
  const response = await fetch(`${BACKEND_API}${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  
  return response.json();
}