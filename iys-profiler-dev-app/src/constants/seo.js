export const APP_URL = 'https://iysskillstech.com';

export const METADATA = {
  metadataBase: APP_URL,
  title: 'Skill Profiling, Competency Profiling - IYS Skills Tech',
  description:
  "Enhance your team's performance with expert skill profiling and competency profiling services by IYS Skills Tech. Tailored strategies for workforce excellence.",
  generator: 'Next.js',
  robots: {
    follow: true,
    index: true
  },
  openGraph: {
    type: 'website',
    title: 'Skill Profiling, Competency Profiling - IYS Skills Tech',
    description:
      "Enhance your team's performance with expert skill profiling and competency profiling services by IYS Skills Tech. Tailored strategies for workforce excellence.",
    url: APP_URL,
    siteName: 'IYS Skills Tech',
    images: `${APP_URL}/og-image.png`
  },
  twitter: {
    card: 'summary',
    site: '@itsyourskills',
    title: 'Skill Profiling, Competency Profiling - IYS Skills Tech',
    description:
      "Enhance your team's performance with expert skill profiling and competency profiling services by IYS Skills Tech. Tailored strategies for workforce excellence.",
    images: `${APP_URL}/og-image.png`
  },
  icons: {
    icon: '/Logo512.png',
    apple: '/Logo512.png'
  },
  alternates: {
    canonical: APP_URL
  },
  other: {
    'google-site-verification': 'ut2CI4AK-pkKFzTrJiVNcJDuczI_r6w-C9j9XZdh5cA'
  }
};
