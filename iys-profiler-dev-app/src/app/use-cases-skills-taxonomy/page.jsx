import { APP_URL, METADATA } from '@/constants';

import UseCases from '@/Pages/UseCases/UseCases';

const mdata = {
  title: 'Use Cases of Skills Taxonomy',
  desc: 'IYS Skills Taxonomy helps in skill-enablement of recruitment, learning and development, career planning and development, workforce planning and more',
  canonical: 'use-cases-skills-taxonomy'
};

export const metadata = {
  ...METADATA,
  title: mdata.title,
  description: mdata.desc,
  alternates: {
    canonical: `${APP_URL}/${mdata.canonical}`
  },
  twitter: {
    ...METADATA.twitter,
    title: mdata.title,
    description: mdata.desc
  },
  openGraph: {
    ...METADATA.openGraph,
    title: mdata.title,
    description: mdata.desc,
    url: `${APP_URL}/${mdata.canonical}`
  }
};

const UseCasesPage = () => {
  return (
    <>
      <UseCases />
    </>
  );
};

export default UseCasesPage;
