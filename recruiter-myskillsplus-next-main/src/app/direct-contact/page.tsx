import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { APP_URL, METADATA } from "@/common/seo";
import DirectContactDetails from "@/components/DirectContact";

export const metadata = {
  ...METADATA,
  title: "Direct Contact",
  description: "Direct Contact",
  alternates: {
    canonical: `${APP_URL}/direct-contact`,
  },
  twitter: {
    ...METADATA.twitter,
    title: "Direct Contact",
    description: "Direct Contact",
  },
  openGraph: {
    ...METADATA.openGraph,
    title: "Direct Contact",
    description: "Direct Contact",
    url: `${APP_URL}/direct-contact`,
  },
};

const DirectContact = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Direct Contact" />
      <DirectContactDetails />
    </DefaultLayout>
  );
};

export default DirectContact;
