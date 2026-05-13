const raw = import.meta.env.VITE_API_URL;
/** Empty string = same origin (Vite dev server proxies `/api` to the backend). */
export const API_BASE_URL = typeof raw === "string" ? raw.replace(/\/$/, "") : "";

export function apiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${normalized}` : normalized;
}
