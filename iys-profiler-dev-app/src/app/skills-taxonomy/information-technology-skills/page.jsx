import ITSkills from '@/Pages/SkillsTaxonomy/ITSkills';
import { APP_URL, METADATA } from '@/constants/seo';

export const metadata = {
  ...METADATA,
  title: 'Information Technology Skills',
  description: 'Most exhaustive Information Technology Skills Taxonomy',
  alternates: {
    canonical: `${APP_URL}/skills-taxonomy/information-technology-skills`
  },
  twitter: {
    ...METADATA.twitter,
    title: 'Information Technology Skills',
    description: 'Most exhaustive Information Technology Skills Taxonomy'
  },
  openGraph: {
    ...METADATA.openGraph,
    title: 'Information Technology Skills',
    description: 'Most exhaustive Information Technology Skills Taxonomy',
    url: `${APP_URL}/skills-taxonomy/information-technology-skills`
  }
};

const SkillsTaxonomyPage = () => <ITSkills />;

export default SkillsTaxonomyPage;
