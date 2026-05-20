import { APP_URL, METADATA } from '@/constants/seo';

import SampleSkillsProfiles from '@/Pages/SampleSkillsProfiles';

export const metadata = {
  ...METADATA,
  title: 'Explore Sample Skills Profiles - IYS Skills Tech',
  description:
    'Find a variety of sample skills profiles to enhance your expertise. Browse through diverse skill sets for professional growth at IYS Skills Tech.',
  alternates: {
    canonical: `${APP_URL}/sample-skills-profiles`
  },
  twitter: {
    ...METADATA.twitter,
    title: 'Explore Sample Skills Profiles - IYS Skills Tech',
    description:
      'Find a variety of sample skills profiles to enhance your expertise. Browse through diverse skill sets for professional growth at IYS Skills Tech.'
  },
  openGraph: {
    ...METADATA.openGraph,
    title: 'Explore Sample Skills Profiles - IYS Skills Tech',
    description:
      'Find a variety of sample skills profiles to enhance your expertise. Browse through diverse skill sets for professional growth at IYS Skills Tech.',
    url: `${APP_URL}/sample-skills-profiles`
  }
};

const DesignSkillProfileList = () => {
  return <SampleSkillsProfiles />;
};

export default DesignSkillProfileList;
