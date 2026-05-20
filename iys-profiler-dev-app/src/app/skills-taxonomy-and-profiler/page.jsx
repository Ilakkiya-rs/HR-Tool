import SkillsTaxonomyAndProfiler from '@/Pages/SkillsTaxonomyAndProfiler';
import { APP_URL, METADATA } from '@/constants/seo';

export const metadata = {
  ...METADATA,
  title: 'Skills Taxonomy and Profiler - IYS Skills Tech',
  description:
    "Explore IYS Skills Tech’s comprehensive skills taxonomy and profiler to navigate and enhance your professional skill set effectively.",
  alternates: {
    canonical: `${APP_URL}/skills-taxonomy-and-profiler`
  },
  twitter: {
    ...METADATA.twitter,
    title: 'Skills Taxonomy and Profiler - IYS Skills Tech',
    description:
      "Explore IYS Skills Tech’s comprehensive skills taxonomy and profiler to navigate and enhance your professional skill set effectively."
  },
  openGraph: {
    ...METADATA.openGraph,
    title: 'Skills Taxonomy and Profiler - IYS Skills Tech',
    description:
      "Explore IYS Skills Tech’s comprehensive skills taxonomy and profiler to navigate and enhance your professional skill set effectively.",
    url: `${APP_URL}/skills-taxonomy-and-profiler`
  }
};

const SkillsTaxonomyAndProfilerPage = () => <SkillsTaxonomyAndProfiler />;

export default SkillsTaxonomyAndProfilerPage;
