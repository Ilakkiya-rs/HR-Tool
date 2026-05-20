// import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { APP_URL, METADATA } from "@/common/seo";
import JspListPage from "@/components/JspList";

export const metadata = {
  ...METADATA,
  title: "Job skills profile",
  description: "job skills profile",
  alternates: {
    canonical: `${APP_URL}/jsp-profile`,
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
    url: `${APP_URL}/jsp-profile`,
  },
};

const JobSkillProfile = () => {
  return (
    <DefaultLayout>
      {/* <Breadcrumb pageName="Job Skills Profile" /> */}
      <JspListPage />
    </DefaultLayout>
  );
};

export default JobSkillProfile;
