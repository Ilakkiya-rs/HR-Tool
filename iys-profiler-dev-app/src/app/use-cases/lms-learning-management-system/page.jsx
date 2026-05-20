import { APP_URL, METADATA } from '@/constants/seo';
import LMS from '@/Pages/UseCases/LMS';

export const metadata = {
  ...METADATA,
  title: 'Learning Management Systems',
  description:
    'IYS Skills Profiler can immensely boost Learning Management Systems value delivery by enabling personal recommendations to users',
  alternates: {
    canonical: `${APP_URL}/use-cases/lms-learning-management-system`
  },
  twitter: {
    ...METADATA.twitter,
    title: 'Learning Management Systems',
    description:
      'IYS Skills Profiler can immensely boost Learning Management Systems value delivery by enabling personal recommendations to users'
  },
  openGraph: {
    ...METADATA.openGraph,
    title: 'Learning Management Systems',
    description:
      'IYS Skills Profiler can immensely boost Learning Management Systems value delivery by enabling personal recommendations to users',
    url: `${APP_URL}/use-cases/lms-learning-management-system`
  }
};

const LMSPage = () => {
  return <LMS />;
};

export default LMSPage;
