import { APP_URL, METADATA } from "@/common/seo";
import HomeLayout from "@/components/Home";

export const metadata = {
  ...METADATA,
  title: "My Skills Plus",
  description: "IYS Skills Profiler Plugin",
  alternates: {
    canonical: `${APP_URL}`,
  },
  twitter: {
    ...METADATA.twitter,
    title: "My Skills Plus",
    description: "IYS Skills Profiler Plugin",
  },
  openGraph: {
    ...METADATA.openGraph,
    title: "My Skills Plus",
    description:
      "Manage your Skills in your Organization in a data-driven manner using IYS Skills Profiler",
    url: `${APP_URL}`,
  },
};

export default async function HomePage() {
  return (
    <>
      <HomeLayout />
    </>
  );
}
