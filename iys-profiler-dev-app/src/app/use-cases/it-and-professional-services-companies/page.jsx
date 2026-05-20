import { APP_URL, METADATA } from '@/constants/seo';
import ITAndPros from '@/Pages/UseCases/ITAndPros';

export const metadata = {
  ...METADATA,
  title: 'Skills Solutions for IT and Professional Services Companies',
  description:
    'Enhance Resource Utilization, Deployment, and Response to Opportunities',
  alternates: {
    canonical: `${APP_URL}/use-cases/it-and-professional-services-companies`
  },
  twitter: {
    ...METADATA.twitter,
    title: 'Skills Solutions for IT and Professional Services Companies',
    description:
      'Enhance Resource Utilization, Deployment, and Response to Opportunities'
  },
  openGraph: {
    ...METADATA.openGraph,
    title: 'Skills Solutions for IT and Professional Services Companies',
    description:
      'Enhance Resource Utilization, Deployment, and Response to Opportunities',
    url: `${APP_URL}/use-cases/it-and-professional-services-companies`
  }
};

const LMSPage = () => {
  return <ITAndPros />;
};

export default LMSPage;
