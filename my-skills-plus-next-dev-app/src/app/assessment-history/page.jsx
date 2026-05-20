import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { APP_URL, METADATA } from "@/common/seo";
import AssessmentPage from "@/components/AssessmentHistory";

export const metadata = {
  ...METADATA,
  title: "Assessment History",
  description: "Assessment History",
  alternates: {
    canonical: `${APP_URL}/assessment-history`,
  },
  twitter: {
    ...METADATA.twitter,
    title: "Assessment History",
    description: "Assessment History",
  },
  openGraph: {
    ...METADATA.openGraph,
    title: "Assessment History",
    description: "Assessment History",
    url: `${APP_URL}/assessment-history`,
  },
};

const AssessmentHistory = () => {

  return (
    <DefaultLayout>
       <Breadcrumb pageName="Assessment History" />
       <AssessmentPage />
    </DefaultLayout>
  );
};

export default AssessmentHistory;