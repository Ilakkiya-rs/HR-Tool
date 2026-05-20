import { APP_URL, METADATA } from '@/constants';

import Newsletter from '@/Componet/Newsletter';

const mdata = {
  title: 'Contact',
  desc: 'Contact page for IYS Skills Tech',
  canonical: 'contact'
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

const contactus = () => {
  return (
    <>
      <Newsletter title="We'd Love to Hear From You" />
    </>
  );
};

export default contactus;
