import OrganizationSkillsManagement from '@/Pages/SaaSApps/OrganizationSkillsManagement';
import { APP_URL, METADATA } from '@/constants/seo';

export const metadata = {
  ...METADATA,
  title: 'Competency Management System, Skills Management Software - IYS Skills Tech',
  description:
    "IYS Skills Tech's competency management system & skills management software helps map, track & manage your workforce's skills. Boost organizational efficiency today!",
  alternates: {
    canonical: `${APP_URL}/saas-application/organization-skills-management-osm`
  },
  twitter: {
    ...METADATA.twitter,
    title: 'Competency Management System, Skills Management Software - IYS Skills Tech',
    description:
      "IYS Skills Tech's competency management system & skills management software helps map, track & manage your workforce's skills. Boost organizational efficiency today!"
  },
  openGraph: {
    ...METADATA.openGraph,
    title: 'Competency Management System, Skills Management Software - IYS Skills Tech',
    description:
      "IYS Skills Tech's competency management system & skills management software helps map, track & manage your workforce's skills. Boost organizational efficiency today!",
    url: `${APP_URL}/saas-application/organization-skills-management-osm`
  }
};

const OrganizationSkillsManagementPage = () => <OrganizationSkillsManagement />;

export default OrganizationSkillsManagementPage;
