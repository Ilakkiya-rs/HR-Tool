/** Base URL of the Vani assessment SPA (no trailing slash). */
const stripTrailingSlashes = (url: string) => url.replace(/\/+$/, "");

export const VANI_APP_ORIGIN = stripTrailingSlashes(
  process.env.NEXT_PUBLIC_VANI_APP_URL || "https://vani.myskillsplus.com",
);

export const VANI_SKILLS_PAGE_URL = `${VANI_APP_ORIGIN}/skills`;
