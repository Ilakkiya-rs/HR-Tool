import { APP_URL, METADATA } from '@/constants/seo';

import JobPortal from '@/Pages/UseCases/JobPortal';

export const metadata = {
  ...METADATA,
  title: 'Skills Data for Job Portals and Recruitment Applications',
  description:
    'Precision and Speed in Skills Matching of Jobs and Job Seekers',
  alternates: {
    canonical: `${APP_URL}/use-cases/job-portals-and-recruitment-applications`
  },
  twitter: {
    ...METADATA.twitter,
    title: 'Skills Data for Job Portals and Recruitment Applications',
    description:
      'Precision and Speed in Skills Matching of Jobs and Job Seekers'
  },
  openGraph: {
    ...METADATA.openGraph,
    title: 'Skills Data for Job Portals and Recruitment Applications',
    description:
      'Precision and Speed in Skills Matching of Jobs and Job Seekers',
    url: `${APP_URL}/use-cases/job-portals-and-recruitment-applications`
  }
};

const Page = () => {
  return <JobPortal />;
};

export default Page;
