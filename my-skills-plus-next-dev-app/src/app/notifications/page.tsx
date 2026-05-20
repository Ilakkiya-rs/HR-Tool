import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { APP_URL, METADATA } from "@/common/seo";
import NotificationsPage from "@/components/NotificationList";

export const metadata = {
  ...METADATA,
  title: "Notifications",
  description: "Notifications",
  alternates: {
    canonical: `${APP_URL}/notifications`,
  },
  twitter: {
    ...METADATA.twitter,
    title: "Notifications",
    description: "Notifications",
  },
  openGraph: {
    ...METADATA.openGraph,
    title: "Notifications",
    description: "Notifications",
    url: `${APP_URL}/notifications`,
  },
};

const Notifications = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Notification" />
      <NotificationsPage />
    </DefaultLayout>
  );
};

export default Notifications;