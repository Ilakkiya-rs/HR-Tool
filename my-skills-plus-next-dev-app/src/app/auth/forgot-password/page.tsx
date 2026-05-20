import React from "react";
import ResetPassword from "@/components/Authforms/ResetPassword";
import { APP_URL, METADATA } from "@/common/seo";

export const metadata = {
  ...METADATA,
  title: "Reset Password",
  description: "Reset your password on MySkillsPlus.",
  alternates: {
    canonical: `${APP_URL}/auth/forgot-password`,
  },
  twitter: {
    ...METADATA.twitter,
    title: "Reset Password",
    description: "Securely reset your MySkillsPlus account password.",
  },
  openGraph: {
    ...METADATA.openGraph,
    title: "Reset Password",
    description: "Securely reset your MySkillsPlus account password.",
    url: `${APP_URL}/auth/forgot-password`,
  },
};

const ForgotPassword: React.FC = () => {
  return <ResetPassword />;
};

export default ForgotPassword;
