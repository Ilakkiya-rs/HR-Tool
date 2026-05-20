import EmployeeSkillsManagement from '@/Pages/SaaSApps/EmployeeSkillsManagement';
import { APP_URL, METADATA } from '@/constants/seo';

export const metadata = {
  ...METADATA,
  title: 'Employee Skills Management',
  description:
    'Manage your Skills in your Organization in a data-driven manner using IYS Skills Profiler',
  alternates: {
    canonical: `${APP_URL}/saas-application/employee-skills-management`
  },
  twitter: {
    ...METADATA.twitter,
    title: 'Employee Skills Management',
    description:
      'Manage your Skills in your Organization in a data-driven manner using IYS Skills Profiler'
  },
  openGraph: {
    ...METADATA.openGraph,
    title: 'Employee Skills Management',
    description:
      'Manage your Skills in your Organization in a data-driven manner using IYS Skills Profiler',
    url: `${APP_URL}/saas-application/employee-skills-management`
  }
};

const EmployeeSkillsManagementPage = () => <EmployeeSkillsManagement />;

export default EmployeeSkillsManagementPage;
