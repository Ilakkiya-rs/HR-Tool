import { APP_URL, METADATA } from '@/constants/seo';

import ExperienceIYSSkillsProfile from '@/Pages/ExperienceIYSSkillsProfile';

export const metadata = {
  ...METADATA,
  title: 'Experience IYS Skills Profiler',
  description:
    'IYS Skills Profiler: Mapping skills for people and jobs, covering knowledge, tools, activities, domain expertise, with an updated skills taxonomy',
  alternates: {
    canonical: `${APP_URL}/experience-iys-skills-profiler`
  },
  twitter: {
    ...METADATA.twitter,
    title: 'Experience IYS Skills Profiler',
    description:
      'IYS Skills Profiler: Mapping skills for people and jobs, covering knowledge, tools, activities, domain expertise, with an updated skills taxonomy'
  },
  openGraph: {
    ...METADATA.openGraph,
    title: 'Experience IYS Skills Profiler',
    description:
      'IYS Skills Profiler: Mapping skills for people and jobs, covering knowledge, tools, activities, domain expertise, with an updated skills taxonomy',
    url: `${APP_URL}/experience-iys-skills-profiler`
  }
};

const ExperienceIYSSkillsProfilePage = () => <ExperienceIYSSkillsProfile />;

export default ExperienceIYSSkillsProfilePage;
