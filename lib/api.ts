const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export const api = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem("auth_token")

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("auth_token")
        localStorage.removeItem("user_data")
        window.location.href = "/login"
        throw new ApiError(401, "Authentication required")
      }

      const errorData = await response.json().catch(() => ({ message: "An error occurred" }))
      throw new ApiError(response.status, errorData.message || "Request failed")
    }

    return response.json()
  },

  // Auth endpoints
  auth: {
    login: (email: string, password: string) =>
      api.request<{ token: string; user: any }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),

    register: (name: string, email: string, password: string) =>
      api.request<{ token: string; user: any }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      }),
  },

  // Habits endpoints
  habits: {
    list: () => api.request<any[]>("/habits"),
    create: (habit: any) =>
      api.request<any>("/habits", {
        method: "POST",
        body: JSON.stringify(habit),
      }),
    update: (id: string, habit: any) =>
      api.request<any>(`/habits/${id}`, {
        method: "PATCH",
        body: JSON.stringify(habit),
      }),
    delete: (id: string) =>
      api.request<void>(`/habits/${id}`, {
        method: "DELETE",
      }),
    checkin: (id: string, date?: string) =>
      api.request<any>(`/habits/${id}/checkin`, {
        method: "POST",
        body: JSON.stringify({ date }),
      }),
    records: (id: string, from?: string, to?: string) => {
      const params = new URLSearchParams()
      if (from) params.append("from", from)
      if (to) params.append("to", to)
      return api.request<any[]>(`/habits/${id}/records?${params}`)
    },
  },

  // Stats endpoint
  stats: {
    get: () => api.request<any>("/stats"),
  },
}
