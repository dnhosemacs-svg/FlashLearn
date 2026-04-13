import type { ApiErrorResponse } from '../types/api'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api/v1'

export class HttpError extends Error {
  status: number
  body: ApiErrorResponse | unknown

  constructor(message: string, status: number, body: ApiErrorResponse | unknown) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.body = body
  }
}

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE'

interface RequestOptions {
  method?: HttpMethod
  body?: unknown
  signal?: AbortSignal
}

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof (value as { message: unknown }).message === 'string'
  )
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    return response.json()
  }

  if (response.status === 204) return null

  const text = await response.text()
  return text || null
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, signal } = options

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  })

  const parsedBody = await parseResponseBody(response)

  if (!response.ok) {
    const message = isApiErrorResponse(parsedBody) ? parsedBody.message : `HTTP ${response.status}`
    throw new HttpError(message, response.status, parsedBody)
  }

  return parsedBody as T
}

export const apiClient = {
  get<T>(path: string, signal?: AbortSignal) {
    return request<T>(path, { method: 'GET', signal })
  },
  post<TResponse, TBody>(path: string, body: TBody, signal?: AbortSignal) {
    return request<TResponse>(path, { method: 'POST', body, signal })
  },
  patch<TResponse, TBody>(path: string, body: TBody, signal?: AbortSignal) {
    return request<TResponse>(path, { method: 'PATCH', body, signal })
  },
  delete<TResponse = null>(path: string, signal?: AbortSignal) {
    return request<TResponse>(path, { method: 'DELETE', signal })
  },
}