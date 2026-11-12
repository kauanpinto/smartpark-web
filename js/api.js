import { APP_CONFIG } from "./config.js";

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json", ...options.headers };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${APP_CONFIG.API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "login.html";
    return;
  }

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || "Erro na requisição");
  }
  
  return data;
}
