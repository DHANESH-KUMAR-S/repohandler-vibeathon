import type { Project, ProjectCreate, ProjectUpdate, TeamSession } from "@/types/project";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

// Token management
let authToken: string | null = localStorage.getItem("authToken");

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem("authToken", token);
  } else {
    localStorage.removeItem("authToken");
  }
};

export const getAuthToken = () => authToken;

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Unknown error" }));
    throw new ApiError(response.status, error.detail || "Request failed");
  }

  return response.json();
}

// Auth API
export const authApi = {
  generateTeam: async (leaderEmail: string) => {
    const result = await apiCall<{ teamId: string; email: string; token: string; message: string }>(
      "/api/auth/generate-team",
      {
        method: "POST",
        body: JSON.stringify({ leaderEmail }),
      }
    );
    setAuthToken(result.token);
    return result;
  },

  teamLogin: async (session: TeamSession) => {
    const result = await apiCall<{ token: string; teamId: string; email: string }>(
      "/api/auth/team-login",
      {
        method: "POST",
        body: JSON.stringify(session),
      }
    );
    setAuthToken(result.token);
    return result;
  },

  adminLogin: async (password: string) => {
    const result = await apiCall<{ token: string; role: string }>(
      "/api/auth/admin-login",
      {
        method: "POST",
        body: JSON.stringify({ password }),
      }
    );
    setAuthToken(result.token);
    return result;
  },

  logout: () => {
    setAuthToken(null);
  },
};

// Projects API
export const projectsApi = {
  getTeamProjects: async (): Promise<Project[]> => {
    return apiCall<Project[]>("/api/projects/");
  },

  createProject: async (project: ProjectCreate): Promise<Project> => {
    return apiCall<Project>("/api/projects/", {
      method: "POST",
      body: JSON.stringify(project),
    });
  },

  updateProject: async (id: string, project: ProjectUpdate): Promise<Project> => {
    return apiCall<Project>(`/api/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(project),
    });
  },

  deleteProject: async (id: string): Promise<void> => {
    return apiCall<void>(`/api/projects/${id}`, {
      method: "DELETE",
    });
  },

  uploadPdf: async (projectId: string, file: File): Promise<{ filename: string; url: string }> => {
    const formData = new FormData();
    formData.append("file", file);

    const headers: HeadersInit = {};
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/upload-pdf`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Upload failed" }));
      throw new ApiError(response.status, error.detail || "Upload failed");
    }

    return response.json();
  },
};

// Admin API
export const adminApi = {
  getAllProjects: async (search?: string): Promise<Project[]> => {
    const params = search ? `?search=${encodeURIComponent(search)}` : "";
    return apiCall<Project[]>(`/api/admin/projects${params}`);
  },

  getStats: async (): Promise<{
    totalProjects: number;
    teamsWithProjects: number;
    projectsWithPdf: number;
  }> => {
    return apiCall("/api/admin/stats");
  },
};
