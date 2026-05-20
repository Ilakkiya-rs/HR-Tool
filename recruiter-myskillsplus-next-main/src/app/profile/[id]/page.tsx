import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { APP_URL, METADATA } from "@/common/seo";
import PublicProfile from "@/components/Export/PublicProfile";

type ExportProps = {
  params: {
    id: number;
  };
};

export const metadata = {
  ...METADATA,
  title: "Profile",
  description: "Profile",
  alternates: {
    canonical: `${APP_URL}/profile/1`,
  },
  twitter: {
    ...METADATA.twitter,
    title: "Profile",
    description: "Profile",
  },
  openGraph: {
    ...METADATA.openGraph,
    title: "Profile",
    description: "Profile",
    url: `${APP_URL}/profile/1`,
  },
};

const Export = ({ params }: ExportProps) => {
  return (
    <DefaultLayout>
      <PublicProfile params={params} />
    </DefaultLayout>
  );
};

export default Export;
