import { APP_URL, METADATA } from '@/constants';

import TermsOfUse from '@/Pages/TermsOfUse';

const mdata = {
  title: 'Terms of Use',
  desc: 'Terms of Use for IYS Skills Tech',
  canonical: 'terms-of-use'
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

const TermsOfUsePage = () => {
  return <TermsOfUse />;
};

export default TermsOfUsePage;
