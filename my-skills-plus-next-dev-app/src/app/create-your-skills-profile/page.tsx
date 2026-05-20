import React from "react";
import CreateSkillsProfile from "@/components/Authforms/CreateSkillsProfile";
import { APP_URL, METADATA } from "@/common/seo";

export const metadata = {
  ...METADATA,
  title: "Create Skills Profile",
  description: "Create Skills Profile to MySkillsPlus",
  alternates: {
    canonical: `${APP_URL}/auth/create-skills-profile`,
  },
  twitter: {
    ...METADATA.twitter,
    title: "Create Skills Profile",
    description: "Create Skills Profile to MySkillsPlus",
  },
  openGraph: {
    ...METADATA.openGraph,
    title: "Create Skills Profile",
    description: "Create Skills Profile to MySkillsPlus",
    url: `${APP_URL}/auth/create-skills-profile`,
  },
};

const CreateSkillProfile: React.FC = () => {
  return <CreateSkillsProfile />;
};

export default CreateSkillProfile;
