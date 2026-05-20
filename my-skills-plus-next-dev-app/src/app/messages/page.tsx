import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { APP_URL, METADATA } from "@/common/seo";
import MessageWindow from "@/components/ChatBox";

export const metadata = {
  ...METADATA,
  title: "Messages",
  description: "Messages",
  alternates: {
    canonical: `${APP_URL}/messages`,
  },
  twitter: {
    ...METADATA.twitter,
    title: "Messages",
    description: "Messages",
  },
  openGraph: {
    ...METADATA.openGraph,
    title: "Messages",
    description: "Messages",
    url: `${APP_URL}/messages`,
  },
};

const MessagePage = () => {

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Messages" />
        <MessageWindow />
    </DefaultLayout>
  );
};

export default MessagePage;