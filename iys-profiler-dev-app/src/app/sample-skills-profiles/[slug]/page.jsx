import Herosection from '@/Componet/SampleSkillsProfiles/HerosectionSlug';
import SlugComponent from '@/Componet/SampleSkillsProfiles/SlugComponent';
import AlterContent from '@/Componet/SampleSkillsProfiles/Altercontent';
import { METADATA } from '@/constants';

export const metadata = {
  ...METADATA,
  title: '',
  description: '',
  alternates: {
    canonical: ``,
  },
  twitter: {
    ...METADATA.twitter,
    title: '',
    description: '',
  },
  openGraph: {
    ...METADATA.openGraph,
    title: '',
    description: '',
    url: ``,
  },
};

// Generate static paths for dynamic slugs
export async function generateStaticParams() {
  const res = await fetch('https://api.myskillsplus.com/users/api/sampleskills?page_no=1&page_size=23329');
  const data = await res.json();

  return data.skills.map((skill) => ({
    slug: skill.skill_name.replace(/\s+/g, '-').replace(/\//g, '_')+'-skills-profile',
  }));
}

// Fetch the data for the page based on the slug
async function fetchData(slug) {
  const skill_name = slug.replace(/-/g, ' ').replace(/_/g, '/');
  const res = await fetch(`https://api.myskillsplus.com/users/api/sampleskills-details/?skillname=${skill_name}`);
  const data = await res.json();
  return data;
}

const SlugComponentPage = async ({ params }) => {
  const { slug } = params;
  const cleanedSlug = slug.replace(/-skills-profile$/, '');
  const upperSlug = params.slug
    .replace(/-skills-profile$/, '')
    .replace(/-/g, ' ')
    .replace(/_/g, '/')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  const skillData = await fetchData(cleanedSlug);

  if (!skillData) {
    return <div>404 - Skill not found</div>;
  }

  const APP_URL = 'https://iysskillstech.com';
  const pageTitle = `Sample ${cleanedSlug} Skills Profile, Job/Employee Skills Profile - IYS`;
  const pageDescription = `Sample ${cleanedSlug} Skills Profile consists of different components including functional / technical skills, soft skills, activities, domain expertise, and others.`;
  const pageUrl = `${APP_URL}/sample-skills-profiles/${slug}`;

  return (
    <>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={pageUrl} />

      {/* Twitter Meta Tags */}
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />

      {/* Canonical */}
      <link rel="canonical" href={pageUrl} />

      <Herosection slug={upperSlug} />
      <SlugComponent params={{ slug : cleanedSlug }} skillData={skillData} />
      <AlterContent slug={upperSlug} />
    </>
  );
};

export default SlugComponentPage;
