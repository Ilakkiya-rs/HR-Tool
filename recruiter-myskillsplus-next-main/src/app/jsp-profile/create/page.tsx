// import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { APP_URL, METADATA } from "@/common/seo";
import CreateJobProfile from "@/components/CreatJsp";

export const metadata = {
  ...METADATA,
  title: "Create Job Profile",
  description: "Create Job Profile",
  alternates: {
    canonical: `${APP_URL}/jsp-profile/create`,
  },
  twitter: {
    ...METADATA.twitter,
    title: "Create Job Profile",
    description: "Create Job Profile",
  },
  openGraph: {
    ...METADATA.openGraph,
    title: "Job skill profile",
    description: "Create Job Profile",
    url: `${APP_URL}/jsp-profile/create`,
  },
};

const CreateJobSkillProfile = () => {
  return (
    <DefaultLayout>
      {/* <Breadcrumb pageName="Job Skills Profile" /> */}
      <CreateJobProfile />
    </DefaultLayout>
  );
};

export default CreateJobSkillProfile;
