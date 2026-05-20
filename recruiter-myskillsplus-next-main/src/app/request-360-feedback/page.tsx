import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { APP_URL, METADATA } from "@/common/seo";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Form from "@/components/360Feedback/form";

export const metadata = {
  ...METADATA,
  title: "Request 360 Feedback",
  description:
    "You can collect feedback from your Juniors (those who have worked under you or for you), Peers (those who have worked alongside you or have been colleagues), and Seniors (Managers, Supervisors, Teachers, and others who have overseen your work directly or indirectly).",
  alternates: {
    canonical: `${APP_URL}`,
  },
  twitter: {
    ...METADATA.twitter,
    title: "Request 360 Feedback",
    description:
      "You can collect feedback from your Juniors (those who have worked under you or for you), Peers (those who have worked alongside you or have been colleagues), and Seniors (Managers, Supervisors, Teachers, and others who have overseen your work directly or indirectly).",
  },
  openGraph: {
    ...METADATA.openGraph,
    title: "Request 360 Feedback",
    description:
      "You can collect feedback from your Juniors (those who have worked under you or for you), Peers (those who have worked alongside you or have been colleagues), and Seniors (Managers, Supervisors, Teachers, and others who have overseen your work directly or indirectly).",
    url: `${APP_URL}`,
  },
};

export default async function Home() {
  return (
    <>
      <DefaultLayout>
        <Breadcrumb pageName="Request 360º Feedback" />
        <Form />
      </DefaultLayout>
    </>
  );
}
