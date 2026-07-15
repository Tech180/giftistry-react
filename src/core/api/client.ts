import { env } from 'core/config/env';
import { ResponseInterceptor } from './interfaces/response-interceptor.interface';

export type { ResponseInterceptor } from './interfaces/response-interceptor.interface';

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

const responseInterceptors: ResponseInterceptor[] = [];
const activeGetRequests = new Map<string, Promise<any>>();

async function executeRequest<T>(
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
    const response = await fetch(`${env.apiUrl}${path}`, {
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

    for (const interceptor of responseInterceptors) {
      try {
        await interceptor(response, json);
      } catch (err) {
        // Silently catch interceptor errors to prevent request breaking
      }
    }

    if (!response.ok) {
      const status = response.status;
      const errorMsg = json.Result?.Message || json.Message || 'An error occurred';
      const errorCode = json.Meta?.Code || 'API_ERROR';
      throw new ApiError(errorMsg, status, errorCode);
    }

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

async function request<T>(
  path: string,
  options: RequestInit = {},
  wrapNamespace?: string
): Promise<T> {
  const method = options.method || 'GET';

  if (method === 'GET') {
    const token = localStorage.getItem('giftistry-token');
    const cacheKey = `${token || ''}:${path}`;

    if (activeGetRequests.has(cacheKey)) {
      return activeGetRequests.get(cacheKey)!;
    }

    const promise = (async () => {
      try {
        return await executeRequest<T>(path, options, wrapNamespace);
      } finally {
        activeGetRequests.delete(cacheKey);
      }
    })();

    activeGetRequests.set(cacheKey, promise);
    return promise;
  }

  return executeRequest<T>(path, options, wrapNamespace);
}

export const apiClient = {
  addResponseInterceptor: (interceptor: ResponseInterceptor) => {
    responseInterceptors.push(interceptor);
    return () => {
      const index = responseInterceptors.indexOf(interceptor);
      if (index !== -1) {
        responseInterceptors.splice(index, 1);
      }
    };
  },

  get: <T>(path: string, options?: RequestInit) =>
    request<T>(path, { ...options, method: 'GET' }),

  post: <T>(path: string, body: any, wrapNamespace?: string, options?: RequestInit) =>
    request<T>(path, { ...options, method: 'POST', body }, wrapNamespace),

  put: <T>(path: string, body: any, wrapNamespace?: string, options?: RequestInit) =>
    request<T>(path, { ...options, method: 'PUT', body }, wrapNamespace),

  patch: <T>(path: string, body: any, wrapNamespace?: string, options?: RequestInit) =>
    request<T>(path, { ...options, method: 'PATCH', body }, wrapNamespace),

  delete: <T>(path: string, body?: any, wrapNamespace?: string, options?: RequestInit) =>
    request<T>(path, { ...options, method: 'DELETE', body }, wrapNamespace),
};
