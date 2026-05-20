import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { APP_URL, METADATA } from "@/common/seo";
import ReviewProfile from "@/components/360Feedback/ReviewProfile";

type ExportProps = {
  params: {
    token: string;
  };
};

export const metadata = {
  ...METADATA,
  title: "Review User",
  description: "Review User",
  alternates: {
    canonical: `${APP_URL}/profile/1`,
  },
  twitter: {
    ...METADATA.twitter,
    title: "Review User",
    description: "Review User",
  },
  openGraph: {
    ...METADATA.openGraph,
    title: "Review User",
    description: "Review User",
    url: `${APP_URL}/profile/1`,
  },
};

const Export = ({ params }: ExportProps) => {
  return (
    <DefaultLayout>
      <ReviewProfile params={params} />
    </DefaultLayout>
  );
};

export default Export;
