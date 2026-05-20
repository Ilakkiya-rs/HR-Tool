/** API base URL — set VITE_API_BASE_URL in .env.local for local Django (profilers enabled). */
export const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "https://api.myskillsplus.com";
