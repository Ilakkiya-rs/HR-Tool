import SkillsBasedHiring from '@/Pages/UseCases/SkillsBasedHiring';
import { APP_URL, METADATA } from '@/constants/seo';

export const metadata = {
  ...METADATA,
  title: 'Skills Based Hiring',
  description:
    'Drastically Improve Skills Mapping, Analysis, and Matching in Recruitment',
  alternates: {
    canonical: `${APP_URL}/use-cases/skills-based-hiring`
  },
  twitter: {
    ...METADATA.twitter,
    title: 'Skills Based Hiring',
    description:
      'Drastically Improve Skills Mapping, Analysis, and Matching in Recruitment'
  },
  openGraph: {
    ...METADATA.openGraph,
    title: 'Skills Based Hiring',
    description:
      'Drastically Improve Skills Mapping, Analysis, and Matching in Recruitment',
    url: `${APP_URL}/use-cases/skills-based-hiring`
  }
};

const TrainingProvidersPage = () => {
  return <SkillsBasedHiring />;
};

export default TrainingProvidersPage;
