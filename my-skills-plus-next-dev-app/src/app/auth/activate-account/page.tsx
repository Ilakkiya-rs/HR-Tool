import React from "react";
import { APP_URL, METADATA } from "@/common/seo";
import ActivateAccount from "@/components/Authforms/ReactiveEmail";

export const metadata = {
  ...METADATA,
  title: "Re-Active",
  description: "Resend to Active-Mail",
  alternates: {
    canonical: `${APP_URL}/auth/activate-account`,
  },
  twitter: {
    ...METADATA.twitter,
    title: "Re-Active",
    description: "Resend to Active-Mail",
  },
  openGraph: {
    ...METADATA.openGraph,
    title: "Re-Active",
    description: "Resend to Active-Mail",
    url: `${APP_URL}/auth/activate-account`,
  },
};

const ResendEmail = () => {

  return <ActivateAccount />;
};

export default ResendEmail;
