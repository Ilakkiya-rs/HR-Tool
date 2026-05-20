import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { APP_URL, METADATA } from "@/common/seo";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ReviewFeedback from "@/components/360Feedback/ViewTable";

export const metadata = {
  ...METADATA,
  title: "Review Feedback",
  description:
    "The feedback is ANONYMOUS. You will not know who provided which feedback on which skill, as this is not important. What is important is that you know how they collectively perceive your skills.",
  alternates: {
    canonical: `${APP_URL}`,
  },
  twitter: {
    ...METADATA.twitter,
    title: "Review Feedback",
    description:
      "The feedback is ANONYMOUS. You will not know who provided which feedback on which skill, as this is not important. What is important is that you know how they collectively perceive your skills.",
  },
  openGraph: {
    ...METADATA.openGraph,
    title: "Review Feedback",
    description:
      "The feedback is ANONYMOUS. You will not know who provided which feedback on which skill, as this is not important. What is important is that you know how they collectively perceive your skills.",
    url: `${APP_URL}`,
  },
};

export default async function Home() {
  return (
    <>
      <DefaultLayout>
        <Breadcrumb pageName="View 360º Feedback" />
        <ReviewFeedback />
      </DefaultLayout>
    </>
  );
}
