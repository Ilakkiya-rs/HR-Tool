import TrainingNeedsAnalysis from '@/Pages/TrainingNeedsAnalysis';
import { APP_URL, METADATA } from '@/constants/seo';

export const metadata = {
  ...METADATA,
  title: 'Training Needs Analysis & Assessment - IYS Skills Tech',
  description: 'Understand and address skill gaps with our comprehensive skill gap analysis and assessment solutions at IYS Skills Tech. Improve workforce & bridge the talent gap.',
  alternates: {
    canonical: `${APP_URL}/training-needs-analysis`
  },
  twitter: {
    ...METADATA.twitter,
    title: 'Training Needs Analysis & Assessment - IYS Skills Tech',
    description: 'Understand and address skill gaps with our comprehensive skill gap analysis and assessment solutions at IYS Skills Tech. Improve workforce & bridge the talent gap.'
  },
  openGraph: {
    ...METADATA.openGraph,
    title: 'Training Needs Analysis & Assessment - IYS Skills Tech',
    description: 'Understand and address skill gaps with our comprehensive skill gap analysis and assessment solutions at IYS Skills Tech. Improve workforce & bridge the talent gap.',
    url: `${APP_URL}/training-needs-analysis`
  }
};

const TrainingProvidersPage = () => {
  return <TrainingNeedsAnalysis />;
};

export default TrainingProvidersPage;
