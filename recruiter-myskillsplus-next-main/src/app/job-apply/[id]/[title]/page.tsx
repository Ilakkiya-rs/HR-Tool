import ApplyJob from "@/components/ApplyJob";
import { APP_URL, METADATA } from "@/common/seo";

type PageProps = {
  params: {
    id: string;
    title: string;
  };
};

export const generateMetadata = ({ params }: PageProps) => {
  return {
    ...METADATA,
    title: params.title || "Apply Job Page",
    description: "Apply Job Page",
    alternates: {
      canonical: `${APP_URL}/job-apply/${params.id}/${params.title}`,
    },
    twitter: {
      ...METADATA.twitter,
      title: params.title || "Apply Job Page",
      description: "Apply Job Page",
    },
    openGraph: {
      ...METADATA.openGraph,
      title: params.title || "Apply Job Page",
      description: "Apply Job Page",
      url: `${APP_URL}/job-apply/${params.id}/${params.title}`,
    },
  };
};

const ApplyJobCandidate = ({ params }: PageProps) => {
  return (
      <ApplyJob jobId={params.id} jobTitle={decodeURIComponent(params.title)} />
  );
};

export default ApplyJobCandidate;