import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Login from "@/components/Authforms/Login";
import { APP_URL, METADATA } from "@/common/seo";

export const metadata = {
  ...METADATA,
  title: "Sign In",
  description: "Sign In to MySkillsPlus",
  alternates: {
    canonical: `${APP_URL}/auth/signin`,
  },
  twitter: {
    ...METADATA.twitter,
    title: "Sign In",
    description: "Sign In to MySkillsPlus",
  },
  openGraph: {
    ...METADATA.openGraph,
    title: "Sign In",
    description: "Sign In to MySkillsPlus",
    url: `${APP_URL}/auth/signin`,
  },
};

const SignIn: React.FC = () => {
  return <Login />;
};

export default SignIn;
