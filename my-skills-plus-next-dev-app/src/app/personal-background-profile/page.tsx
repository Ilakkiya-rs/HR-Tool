import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { APP_URL, METADATA } from "@/common/seo";
import PersonalBackgroundProfileForm from "@/components/PersonalBackgroundProfile";

export const metadata = {
  ...METADATA,
  title: "Personal Background Profile",
  description: "Personal Background Profile",
  alternates: {
    canonical: `${APP_URL}/personal-background-profile`,
  },
  twitter: {
    ...METADATA.twitter,
    title: "Personal Background Profile",
    description: "personal background profile",
  },
  openGraph: {
    ...METADATA.openGraph,
    title: "Personal Background Profile",
    description: "personal background profile",
    url: `${APP_URL}/personal-background-profile`,
  },
};

const PersonalBackgroundProfile = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Personal Background Profile" />
      <PersonalBackgroundProfileForm />
    </DefaultLayout>
  );
};

export default PersonalBackgroundProfile;
