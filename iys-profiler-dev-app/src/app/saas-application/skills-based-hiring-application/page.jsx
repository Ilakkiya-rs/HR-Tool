import { APP_URL, METADATA } from '@/constants/seo';

import SkillsBasedHiringApplication from '@/Pages/SaaSApps/SkillsBasedHiringApplication';

export const metadata = {
  ...METADATA,
  title: 'Skill Based Hiring, Recruitment, Talent Management & Training - IYS Skills Tech',
  description:
    'IYS Skills Tech offers comprehensive skill based training, hiring, recruitment, and talent management solutions with our advanced SaaS application.',
  alternates: {
    canonical: `${APP_URL}/saas-application/skills-based-hiring-application`
  },
  twitter: {
    ...METADATA.twitter,
    title: 'Skill Based Hiring, Recruitment, Talent Management & Training - IYS Skills Tech',
    description:
      'IYS Skills Tech offers comprehensive skill based training, hiring, recruitment, and talent management solutions with our advanced SaaS application.'
  },
  openGraph: {
    ...METADATA.openGraph,
    title: 'Skill Based Hiring, Recruitment, Talent Management & Training - IYS Skills Tech',
    description:
      'IYS Skills Tech offers comprehensive skill based training, hiring, recruitment, and talent management solutions with our advanced SaaS application.',
    url: `${APP_URL}/saas-application/skills-based-hiring-application`
  }
};

const SkillsBasedHiringApplicationPage = () => <SkillsBasedHiringApplication />;

export default SkillsBasedHiringApplicationPage;
