const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export class ApiError extends Error {
  status: number;
  code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

export type ResponseInterceptor = (response: Response, json: any) => void | Promise<void>;

const responseInterceptors: ResponseInterceptor[] = [];

async function request<T>(
  path: string,
  options: RequestInit = {},
  wrapNamespace?: string
): Promise<T> {
  const token = localStorage.getItem('giftistry-token');
  const headers = new Headers(options.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  headers.set('Accept', 'application/json');

  let body: any = options.body;
  if (body && typeof body === 'object' && !(body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
    let data: any = body;
    if (wrapNamespace) {
      data = {
        Giftistry: {
          [wrapNamespace]: data
        }
      };
    }
    body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
      body,
      credentials: 'include',
    });

    let json: any = {};
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      json = await response.json();
    }

    // Execute registered response interceptors
    for (const interceptor of responseInterceptors) {
      try {
        await interceptor(response, json);
      } catch (err) {
        // Silently catch interceptor errors to prevent request breaking
      }
    }

    if (!response.ok) {
      const status = response.status;
      const errorMsg = json.Result?.message || json.message || 'An error occurred';
      const errorCode = json.Meta?.Code || 'API_ERROR';
      throw new ApiError(errorMsg, status, errorCode);
    }

    // Elysia index.ts mapResponse maps payload to { Meta: ..., Result: ... }
    if (json.Result !== undefined) {
      return json.Result as T;
    }

    return json as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Network connection failure',
      500,
      'NETWORK_ERROR'
    );
  }
}

export const apiClient = {
  addResponseInterceptor: (interceptor: ResponseInterceptor) => {
    responseInterceptors.push(interceptor);
  },

  get: <T>(path: string, options?: RequestInit) =>
    request<T>(path, { ...options, method: 'GET' }),

  post: <T>(path: string, body: any, wrapNamespace?: string, options?: RequestInit) =>
    request<T>(path, { ...options, method: 'POST', body }, wrapNamespace),

  put: <T>(path: string, body: any, wrapNamespace?: string, options?: RequestInit) =>
    request<T>(path, { ...options, method: 'PUT', body }, wrapNamespace),

  delete: <T>(path: string, options?: RequestInit) =>
    request<T>(path, { ...options, method: 'DELETE' }),
};
