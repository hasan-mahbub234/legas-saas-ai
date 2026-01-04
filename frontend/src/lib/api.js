import { API_BASE_URL } from "./constants";

let accessToken = null;
let refreshToken = null;
let currentUser = null;

export const setTokens = (access, refresh) => {
  accessToken = access;
  refreshToken = refresh;
  if (typeof window !== "undefined") {
    if (access) {
      localStorage.setItem("accessToken", access);
    } else {
      localStorage.removeItem("accessToken");
    }
    if (refresh) {
      localStorage.setItem("refreshToken", refresh);
    } else {
      localStorage.removeItem("refreshToken");
    }
  }
};

export const setAccessToken = (token) => {
  accessToken = token;
  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem("accessToken", token);
    } else {
      localStorage.removeItem("accessToken");
    }
  }
};

export const getAccessToken = () => {
  if (!accessToken && typeof window !== "undefined") {
    accessToken = localStorage.getItem("accessToken");
  }
  return accessToken;
};

export const getRefreshToken = () => {
  if (!refreshToken && typeof window !== "undefined") {
    refreshToken = localStorage.getItem("refreshToken");
  }
  return refreshToken;
};

export const setCurrentUser = (user) => {
  currentUser = user;
};

export const getCurrentUser = () => currentUser;

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const refreshAccessToken = async () => {
  const refresh = getRefreshToken();
  if (!refresh) {
    throw new Error("No refresh token available");
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token: refresh }),
  });

  if (!response.ok) {
    setTokens(null, null);
    setCurrentUser(null);
    throw new Error("Session expired. Please login again.");
  }

  const data = await response.json();
  setTokens(data.access_token, data.refresh_token);
  setCurrentUser(data.user);
  return data.access_token;
};

export async function apiRequest(endpoint, options = {}) {
  const token = getAccessToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  let response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (response.status === 401 && !options.skipRetry) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const newToken = await refreshAccessToken();
        isRefreshing = false;
        onTokenRefreshed(newToken);

        headers.Authorization = `Bearer ${newToken}`;
        response = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...config,
          headers,
        });
      } catch (error) {
        isRefreshing = false;
        throw error;
      }
    } else {
      const newToken = await new Promise((resolve) => {
        subscribeTokenRefresh(resolve);
      });
      headers.Authorization = `Bearer ${newToken}`;
      response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...config,
        headers,
      });
    }
  }

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  return response.json();
}

export const authAPI = {
  async register(email, password, fullName) {
    const response = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        full_name: fullName,
      }),
    });
    setTokens(response.access_token, response.refresh_token);
    setCurrentUser(response.user);
    return response;
  },

  async login(email, password) {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setTokens(response.access_token, response.refresh_token);
    setCurrentUser(response.user);
    return response;
  },

  async logout() {
    const refresh = getRefreshToken();
    try {
      if (refresh) {
        await apiRequest("/auth/logout", {
          method: "POST",
          body: JSON.stringify({ refresh_token: refresh }),
        });
      }
    } finally {
      setTokens(null, null);
      setCurrentUser(null);
    }
  },

  async getProfile() {
    const user = await apiRequest("/auth/me");
    setCurrentUser(user);
    return user;
  },

  async updateProfile(data) {
    const user = await apiRequest("/auth/me", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    setCurrentUser(user);
    return user;
  },

  async changePassword(data) {
    return apiRequest("/auth/me/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async createApiKey(data) {
    return apiRequest("/auth/me/api-keys", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getApiKeys() {
    return apiRequest("/auth/me/api-keys");
  },

  async revokeApiKey(id) {
    return apiRequest(`/auth/me/api-keys/${id}`, {
      method: "DELETE",
    });
  },
};

export const documentsAPI = {
  async upload(file, description = "", tags = "") {
    const token = getAccessToken();
    const formData = new FormData();
    formData.append("file", file);
    if (description) formData.append("description", description);
    if (tags) formData.append("tags", tags);

    const response = await fetch(`${API_BASE_URL}/documents/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = "Upload failed";
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  },

  async list(params = {}) {
    const { skip = 0, limit = 100, status } = params;
    const queryParams = new URLSearchParams();
    queryParams.append("skip", skip.toString());
    queryParams.append("limit", limit.toString());
    if (status) queryParams.append("status", status);

    return apiRequest(`/documents?${queryParams.toString()}`);
  },

  async get(id) {
    return apiRequest(`/documents/${id}`);
  },

  async delete(id) {
    return apiRequest(`/documents/${id}`, { method: "DELETE" });
  },

  download(id) {
    const token = getAccessToken();
    return `${API_BASE_URL}/documents/${id}/download?token=${token}`;
  },

  async getAnalysis(id) {
    return apiRequest(`/documents/${id}/analysis`);
  },

  async getText(id) {
    return apiRequest(`/documents/${id}/text`);
  },
};

export const aiAPI = {
  async chat(data) {
    return apiRequest("/ai/chat", {
      method: "POST",
      body: JSON.stringify({
        document_id: data.document_id,
        question: data.question,
        temperature: data.temperature || 0.7,
      }),
    });
  },

  async getChatHistory(documentId, params = {}) {
    const { skip = 0, limit = 50 } = params;
    const queryParams = new URLSearchParams();
    queryParams.append("skip", skip.toString());
    queryParams.append("limit", limit.toString());

    return apiRequest(
      `/ai/chat-history/${documentId}?${queryParams.toString()}`
    );
  },

  async analyzeText(text) {
    return apiRequest("/ai/analyze-text", {
      method: "POST",
      body: JSON.stringify({ text }),
    });
  },

  async extractClauses(documentId) {
    return apiRequest(`/ai/clauses/${documentId}`);
  },

  async summarize(documentId) {
    return apiRequest(`/ai/summarize/${documentId}`, {
      method: "POST",
    });
  },

  async healthCheck() {
    return apiRequest("/ai/health");
  },

  async testConfig() {
    return apiRequest("/ai/test-config");
  },
};
