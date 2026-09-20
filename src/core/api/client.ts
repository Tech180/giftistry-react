import { env } from 'core/config/env';
import { ApiError } from './api-error';
import { AUTH_TOKEN_STORAGE_KEY } from './constants/token-storage-key.constant';
import type { ResponseInterceptor } from './interfaces/response-interceptor.interface';
import { asApiEnvelope } from './utils/as-api-envelope.util';
import { formatApiErrorMessage } from './utils/format-api-error-message.util';

export type { ResponseInterceptor } from './interfaces/response-interceptor.interface';
export { ApiError } from './api-error';

type ApiRequestInit = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

const responseInterceptors: ResponseInterceptor[] = [];
const activeGetRequests = new Map<string, Promise<unknown>>();

async function executeRequest<T>(
  path: string,
  options: ApiRequestInit = {},
  wrapNamespace?: string
): Promise<T> {
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  const headers = new Headers(options.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  headers.set('Accept', 'application/json');

  let body: BodyInit | undefined;
  const requestBody = options.body;
  if (
    requestBody &&
    typeof requestBody === 'object' &&
    !(requestBody instanceof FormData)
  ) {
    headers.set('Content-Type', 'application/json');
    let data: unknown = requestBody;
    if (wrapNamespace) {
      data = {
        Giftistry: {
          [wrapNamespace]: data,
        },
      };
    }
    body = JSON.stringify(data);
  } else if (
    typeof requestBody === 'string' ||
    requestBody instanceof FormData ||
    requestBody instanceof Blob ||
    requestBody instanceof ArrayBuffer ||
    ArrayBuffer.isView(requestBody)
  ) {
    body = requestBody as BodyInit;
  }

  try {
    const response = await fetch(`${env.apiUrl}${path}`, {
      ...options,
      headers,
      body,
      credentials: 'include',
    });

    let json: unknown = {};
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      json = await response.json();
    }

    for (const interceptor of responseInterceptors) {
      try {
        await interceptor(response, json);
      } catch (err) {
        console.error('Response interceptor failed:', err);
      }
    }

    const envelope = asApiEnvelope(json);

    if (!response.ok) {
      const status = response.status;
      const resultMessage =
        envelope.Result && typeof envelope.Result === 'object' && envelope.Result !== null
          ? (envelope.Result as { Message?: unknown }).Message
          : undefined;
      const rawMessage = resultMessage ?? envelope.Message ?? 'An error occurred';
      const errorMsg = formatApiErrorMessage(rawMessage);
      const errorCode =
        typeof envelope.Meta?.Code === 'string' ? envelope.Meta.Code : 'API_ERROR';
      throw new ApiError(errorMsg, status, errorCode, rawMessage);
    }

    if (envelope.Result !== undefined) {
      return envelope.Result as T;
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
  options: ApiRequestInit = {},
  wrapNamespace?: string
): Promise<T> {
  const method = options.method || 'GET';

  if (method === 'GET') {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    const cacheKey = `${token || ''}:${path}`;

    const existing = activeGetRequests.get(cacheKey);
    if (existing) {
      return existing as Promise<T>;
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

  get: <T>(path: string, options?: ApiRequestInit) =>
    request<T>(path, { ...options, method: 'GET' }),

  post: <T>(path: string, body: unknown, wrapNamespace?: string, options?: ApiRequestInit) =>
    request<T>(path, { ...options, method: 'POST', body }, wrapNamespace),

  put: <T>(path: string, body: unknown, wrapNamespace?: string, options?: ApiRequestInit) =>
    request<T>(path, { ...options, method: 'PUT', body }, wrapNamespace),

  patch: <T>(path: string, body: unknown, wrapNamespace?: string, options?: ApiRequestInit) =>
    request<T>(path, { ...options, method: 'PATCH', body }, wrapNamespace),

  delete: <T>(path: string, body?: unknown, wrapNamespace?: string, options?: ApiRequestInit) =>
    request<T>(path, { ...options, method: 'DELETE', body }, wrapNamespace),
};
