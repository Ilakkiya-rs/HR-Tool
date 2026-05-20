import DefaultLayout from "@/components/Layouts/DefaultLayout";
import EditJobProfile from "@/components/EditJSPPage";
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
    title: params.title || "Edit Job Profile",
    description: "Edit Job Profile",
    alternates: {
      canonical: `${APP_URL}/jsp-profile/edit/${params.id}/${params.title}`,
    },
    twitter: {
      ...METADATA.twitter,
      title: params.title || "Edit Job Profile",
      description: "Edit Job Profile",
    },
    openGraph: {
      ...METADATA.openGraph,
      title: params.title || "Edit Job Profile",
      description: "Edit Job Profile",
      url: `${APP_URL}/jsp-profile/edit/${params.id}/${params.title}`,
    },
  };
};

const EditJobSkillProfile = ({ params }: PageProps) => {
  return (
    <DefaultLayout>
      <EditJobProfile jobId={params.id} jobTitle={decodeURIComponent(params.title)} />
    </DefaultLayout>
  );
};

export default EditJobSkillProfile;
