import SkillsGapAnalysis from '@/Pages/UseCases/SkillsGapAnalysis';
import { APP_URL, METADATA } from '@/constants/seo';

export const metadata = {
  ...METADATA,
  title: 'Skill Gap Analysis & Assessment - IYS Skills Tech',
  description: 'Understand and address skill gaps with our comprehensive skill gap analysis and assessment solutions at IYS Skills Tech. Improve workforce & bridge the talent gap.',
  alternates: {
    canonical: `${APP_URL}/use-cases/skills-gap-analysis`
  },
  twitter: {
    ...METADATA.twitter,
    title: 'Skill Gap Analysis & Assessment - IYS Skills Tech',
    description: 'Understand and address skill gaps with our comprehensive skill gap analysis and assessment solutions at IYS Skills Tech. Improve workforce & bridge the talent gap.'
  },
  openGraph: {
    ...METADATA.openGraph,
    title: 'Skill Gap Analysis & Assessment - IYS Skills Tech',
    description: 'Understand and address skill gaps with our comprehensive skill gap analysis and assessment solutions at IYS Skills Tech. Improve workforce & bridge the talent gap.',
    url: `${APP_URL}/use-cases/skills-gap-analysis`
  }
};

const TrainingProvidersPage = () => {
  return <SkillsGapAnalysis />;
};

export default TrainingProvidersPage;
