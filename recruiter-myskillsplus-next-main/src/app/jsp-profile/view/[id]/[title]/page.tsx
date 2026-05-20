import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ViewJobProfile from "@/components/ViewJSPPage";
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
    title: params.title || "View Job Profile",
    description: "View Job Profile",
    alternates: {
      canonical: `${APP_URL}/jsp-profile/view/${params.id}/${params.title}`,
    },
    twitter: {
      ...METADATA.twitter,
      title: params.title || "View Job Profile",
      description: "View Job Profile",
    },
    openGraph: {
      ...METADATA.openGraph,
      title: params.title || "View Job Profile",
      description: "View Job Profile",
      url: `${APP_URL}/jsp-profile/view/${params.id}/${params.title}`,
    },
  };
};

const ViewJobSkillProfile = ({ params }: PageProps) => {
  return (
    <DefaultLayout>
      <ViewJobProfile jobId={params.id} jobTitle={decodeURIComponent(params.title)} />
    </DefaultLayout>
  );
};

export default ViewJobSkillProfile;
