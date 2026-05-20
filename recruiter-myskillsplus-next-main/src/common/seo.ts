// export const APP_URL = "http://localhost:3000";
export const APP_URL = "https://myskillsplus.com";

export const METADATA = {
  metadataBase: APP_URL,
  title: "IYS Skills Tech",
  description:
    "Solving the Skills Data Problem and offering solutions for Skills Management.",
  generator: "Next.js",
  robots: {
    follow: true,
    index: true,
  },
  openGraph: {
    type: "website",
    title: "IYS Skills Tech",
    description:
      "Solving the Skills Data Problem and offering solutions for Skills Management.",
    url: APP_URL,
    siteName: "IYS Skills Tech",
    images: `${APP_URL}/og-image.png`,
  },
  twitter: {
    card: "summary",
    site: "@itsyourskills",
    title: "IYS Skills Tech",
    description:
      "Solving the Skills Data Problem and offering solutions for Skills Management.",
    images: `${APP_URL}/og-image.png`,
  },
  icons: {
    icon: "/Logo512.png",
    apple: "/Logo512.png",
  },
  alternates: {
    canonical: APP_URL,
  },
  other: {
    "google-site-verification": "ut2CI4AK-pkKFzTrJiVNcJDuczI_r6w-C9j9XZdh5cA",
  },
};
