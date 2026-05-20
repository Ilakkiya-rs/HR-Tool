// import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { APP_URL, METADATA } from "@/common/seo";
import ExperienceHomePlugin from "@/components/ExperienceHomePlugin";

export const metadata = {
  ...METADATA,
  title: "Job skills profile",
  description: "job skills profile",
  alternates: {
    canonical: `${APP_URL}/job-skill-profile`,
  },
  twitter: {
    ...METADATA.twitter,
    title: "Job skills profile",
    description: "Job skills profile",
  },
  openGraph: {
    ...METADATA.openGraph,
    title: "Job skill profile",
    description: "Job skills profile",
    url: `${APP_URL}/job-skill-profile`,
  },
};

const JobSkillProfile = () => {
  return (
    <DefaultLayout>
      {/* <Breadcrumb pageName="Job Skills Profile" /> */}
      <ExperienceHomePlugin />
    </DefaultLayout>
  );
};

export default JobSkillProfile;
