import { APP_URL, METADATA } from '@/constants/seo';

import SkillsManagementConsulting from "@/Pages/Consulting/SkillsManagementConsulting";

export const metadata = {
  ...METADATA,
  title: 'Skills Management Consulting',
  description:
    'IYS’s helps organizaiton put in place Processes and systems on Skills Management.',
  alternates: {
    canonical: `${APP_URL}/consulting/skills-management-consulting`
  },
  twitter: {
    ...METADATA.twitter,
    title: 'Skills Management Consulting',
    description:
      'IYS’s helps organizaiton put in place Processes and systems on Skills Management.'
  },
  openGraph: {
    ...METADATA.openGraph,
    title: 'Skills Management Consulting',
    description:
      'IYS’s helps organizaiton put in place Processes and systems on Skills Management.',
    url: `${APP_URL}/consulting/skills-management-consulting`
  }
};

const SkillsManagementConsultingPage = () => <SkillsManagementConsulting />;

export default SkillsManagementConsultingPage;
