import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { APP_URL, METADATA } from "@/common/seo";
import ClosedMessage from "@/components/ClosedMessages";

export const metadata = {
  ...METADATA,
  title: "Closed Messages",
  description: "Closed Messages",
  alternates: {
    canonical: `${APP_URL}/closed-messages`,
  },
  twitter: {
    ...METADATA.twitter,
    title: "Closed Messages",
    description: "Closed Messages",
  },
  openGraph: {
    ...METADATA.openGraph,
    title: "Closed Messages",
    description: "Closed Messages",
    url: `${APP_URL}/closed-messages`,
  },
};

const ClosedMessagePage = () => {

  return (
    <DefaultLayout>
       <Breadcrumb pageName="Closed Messages" />
       <ClosedMessage />
    </DefaultLayout>
  );
};

export default ClosedMessagePage;