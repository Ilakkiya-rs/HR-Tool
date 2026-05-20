import { APP_URL, METADATA } from '@/constants/seo';

import UsageOptions from '@/Pages/UsageOptions';

export const metadata = {
  ...METADATA,
  title: 'Skills API / Plugin',
  description: 'IYS offers multiple options to HR Tech Developers and Others',
  alternates: {
    canonical: `${APP_URL}/skills-api-plugin`
  },
  twitter: {
    ...METADATA.twitter,
    title: 'Skills API / Plugin',
    description: 'IYS offers multiple options to HR Tech Developers and Others'
  },
  openGraph: {
    ...METADATA.openGraph,
    title: 'Skills API / Plugin',
    description: 'IYS offers multiple options to HR Tech Developers and Others',
    url: `${APP_URL}/skills-api-plugin`
  }
};

const SkillsProfilePluginPage = () => {
  return <UsageOptions />;
};

export default SkillsProfilePluginPage;
