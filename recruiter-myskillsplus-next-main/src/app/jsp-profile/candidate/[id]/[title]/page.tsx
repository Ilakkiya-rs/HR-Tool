import CandidateListPage from "@/components/CandidateListPage";
import { APP_URL, METADATA } from "@/common/seo";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

type PageProps = {
  params: {
    id: string;
    title: string;
  };
};

export const generateMetadata = ({ params }: PageProps) => {
  return {
    ...METADATA,
    title: "Candidate List Page",
    description: "Candidate List Page",
    alternates: {
      canonical: `${APP_URL}/jsp-profile/candidates/${params.id}/${params.title}`,
    },
    twitter: {
      ...METADATA.twitter,
      title: "Candidate List Page",
      description: "Candidate List Page",
    },
    openGraph: {
      ...METADATA.openGraph,
      title: "Candidate List Page",
      description: "Candidate List Page",
      url: `${APP_URL}/jsp-profile/candidates/${params.id}/${params.title}`,
    },
  };
};

const CandidateList = ({ params }: PageProps) => {
  return (
    <DefaultLayout>
      <CandidateListPage jobId={params.id} jobTitle={decodeURIComponent(params.title)} />
    </DefaultLayout>
  );
};

export default CandidateList;