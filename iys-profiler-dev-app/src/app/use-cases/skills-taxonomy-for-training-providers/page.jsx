import TrainingProviders from '@/Pages/UseCases/TrainingProviders';
import { APP_URL, METADATA } from '@/constants/seo';

export const metadata = {
  ...METADATA,
  title: 'Training Providers',
  description:
    'If you are a Training Provider You can boost your business with IYS Skills Profiler',
  alternates: {
    canonical: `${APP_URL}/use-cases/skills-taxonomy-for-training-providers`
  },
  twitter: {
    ...METADATA.twitter,
    title: 'Training Providers',
    description:
      'If you are a Training Provider You can boost your business with IYS Skills Profiler'
  },
  openGraph: {
    ...METADATA.openGraph,
    title: 'Training Providers',
    description:
      'If you are a Training Provider You can boost your business with IYS Skills Profiler',
    url: `${APP_URL}/use-cases/skills-taxonomy-for-training-providers`
  }
};

const TrainingProvidersPage = () => {
  return <TrainingProviders />;
};

export default TrainingProvidersPage;
