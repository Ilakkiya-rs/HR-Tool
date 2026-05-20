import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { APP_URL, METADATA } from "@/common/seo";
import VspAndOthersForm from "@/components/VspAndOthers";

export const metadata = {
  ...METADATA,
  title: "VSP and Others",
  description: "VSP and Others",
  alternates: {
    canonical: `${APP_URL}/vsp-and-others`,
  },
  twitter: {
    ...METADATA.twitter,
    title: "VSP and Others",
    description: "VSP and Others",
  },
  openGraph: {
    ...METADATA.openGraph,
    title: "VSP and Others",
    description: "VSP and Others",
    url: `${APP_URL}/vsp-and-others`,
  },
};

const VspAndOthers = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Work Preference" />
      <VspAndOthersForm />
    </DefaultLayout>
  );
};

export default VspAndOthers;