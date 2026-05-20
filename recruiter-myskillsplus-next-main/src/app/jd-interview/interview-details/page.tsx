import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { APP_URL, METADATA } from "@/common/seo";
import JdInterviewDetails from "@/components/JdInterviewDetails";

export const metadata = {
  ...METADATA,
  title: "Interview Details",
  description: "Interview Details",
  alternates: {
    canonical: `${APP_URL}/jd-interview/interview-details`,
  },
  twitter: {
    ...METADATA.twitter,
    title: "Interview Details",
    description: "Interview Details",
  },
  openGraph: {
    ...METADATA.openGraph,
    title: "Interview Details",
    description: "Interview Details",
    url: `${APP_URL}/jd-interview/interview-details`,
  },
};

const JdInterview = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Interview Details" />
      <JdInterviewDetails />
    </DefaultLayout>
  );
};

export default JdInterview;
