import type { ServiceResult } from "@/types/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";

export class ApiUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiUnavailableError";
  }
}

export function isApiConfigured(): boolean {
  return API_BASE_URL.length > 0;
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<ServiceResult<T>> {
  if (!isApiConfigured()) {
    throw new ApiUnavailableError("VITE_API_BASE_URL is not configured.");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    throw new ApiUnavailableError(`Request failed with status ${response.status}.`);
  }

  return {
    data: (await response.json()) as T,
    source: "api",
  };
}

