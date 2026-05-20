import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { APP_URL, METADATA } from "@/common/seo";
import WorkPreferenceForm from "@/components/WorkPreference";

export const metadata = {
  ...METADATA,
  title: "Work Preference",
  description: "Work Preference",
  alternates: {
    canonical: `${APP_URL}/work-preference`,
  },
  twitter: {
    ...METADATA.twitter,
    title: "Work Preference",
    description: "Work Preference",
  },
  openGraph: {
    ...METADATA.openGraph,
    title: "Work Preference",
    description: "Work Preference",
    url: `${APP_URL}/work-preference`,
  },
};

const WorkPreference = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Work Preference" />
      <WorkPreferenceForm />
    </DefaultLayout>
  );
};

export default WorkPreference;
