import { API_BASE_URL } from '@/constants/config';

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
    authToken = token;
}

export class ApiError extends Error {
    constructor(public readonly status: number, message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

    if (!response.ok) {
        const text = await response.text().catch(() => response.statusText);
        throw new ApiError(response.status, text);
    }

    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
}

export const api = {
    get: <T>(path: string) =>
        request<T>(path, { method: 'GET' }),

    post: <T>(path: string, body?: unknown) =>
        request<T>(path, { method: 'POST', body: JSON.stringify(body) }),

    put: <T>(path: string, body?: unknown) =>
        request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),

    delete: <T>(path: string) =>
        request<T>(path, { method: 'DELETE' }),
};
