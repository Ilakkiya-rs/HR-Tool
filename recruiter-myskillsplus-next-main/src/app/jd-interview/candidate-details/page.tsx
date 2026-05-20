import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { APP_URL, METADATA } from "@/common/seo";
import JdCandidateDetails from "@/components/JdCandiateDetails";

export const metadata = {
  ...METADATA,
  title: "Candidates",
  description: "Candidates",
  alternates: {
    canonical: `${APP_URL}/jd-interview/canidate-details`,
  },
  twitter: {
    ...METADATA.twitter,
    title: "Candidates",
    description: "Candidates",
  },
  openGraph: {
    ...METADATA.openGraph,
    title: "Candidates",
    description: "Candidates",
    url: `${APP_URL}/jd-interview/candidate-details`,
  },
};

const JdCandidateListPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Candidates" />
      <JdCandidateDetails />
    </DefaultLayout>
  );
};

export default JdCandidateListPage;
