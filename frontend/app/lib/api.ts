const API_URL = "https://link-sharing-app-backend-zzvf.onrender.com";

class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly path: string,
  ) {
    super("The request could not be completed.");
  }
}

export function readableError(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      return error.path === "/auth/sign-in"
        ? "Email or password is incorrect. Please try again."
        : "Your session has expired. Please sign in again.";
    }
    if (error.status === 403) return "You do not have permission to do that.";
    if (error.status === 404) {
      return error.path.startsWith("/users/")
        ? "This profile is unavailable."
        : "We could not find what you requested.";
    }
    if (error.path === "/auth/sign-up" && error.status < 500) {
      return "We could not create your account. That email may already be in use.";
    }
    if (error.path === "/users/avatar" && error.status < 500) {
      return "We could not upload that image. Use a PNG or JPG below 2MB.";
    }
    if (error.status >= 500) {
      return "Our service is temporarily unavailable. Please try again shortly.";
    }
    return "We could not save your changes. Please review them and try again.";
  }
  if (error instanceof TypeError) {
    return "We could not reach the service. Check your connection and try again.";
  }
  return "Something went wrong. Please try again.";
}

export async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!response.ok) {
    throw new ApiError(response.status, path);
  }
  return response.json() as Promise<T>;
}
