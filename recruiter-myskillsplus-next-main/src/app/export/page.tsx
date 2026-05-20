import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { APP_URL, METADATA } from "@/common/seo";
import ExperienceProfilePlugin from "@/components/ExperienceProfilePlugin";

export const metadata = {
  ...METADATA,
  title: "Export",
  description: "Export your profile",
  alternates: {
    canonical: `${APP_URL}/Export`,
  },
  twitter: {
    ...METADATA.twitter,
    title: "Export",
    description: "Export your profile",
  },
  openGraph: {
    ...METADATA.openGraph,
    title: "Export",
    description: "Export your profile",
    url: `${APP_URL}/Export`,
  },
};

const Export = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Export Profile" />
      <ExperienceProfilePlugin />
    </DefaultLayout>
  );
};

export default Export;
