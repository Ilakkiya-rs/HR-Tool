import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { APP_URL, METADATA } from "@/common/seo";
import ExperienceHomePlugin from "@/components/ExperienceHomePlugin";

export const metadata = {
  ...METADATA,
  title: "Create skill profile",
  description: "create your profile",
  alternates: {
    canonical: `${APP_URL}/create-skill-profile`,
  },
  twitter: {
    ...METADATA.twitter,
    title: "Create skill profile",
    description: "Export your profile",
  },
  openGraph: {
    ...METADATA.openGraph,
    title: "Create skill profile",
    description: "Export your profile",
    url: `${APP_URL}/create-skill-profile`,
  },
};

const CreateSkillProfile = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="MySkill Profile" />
      <ExperienceHomePlugin />
    </DefaultLayout>
  );
};

export default CreateSkillProfile;
