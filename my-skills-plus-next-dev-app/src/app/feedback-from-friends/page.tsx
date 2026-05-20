import React from "react";
import FriendsFeedback from "@/components/Authforms/FriendsFeedback";
import { APP_URL, METADATA } from "@/common/seo";

export const metadata = {
  ...METADATA,
  title: "Friends Feedback",
  description: "Friends Feedback to MySkillsPlus",
  alternates: {
    canonical: `${APP_URL}/auth/friends-feedback`,
  },
  twitter: {
    ...METADATA.twitter,
    title: "Friends Feedback",
    description: "Friends Feedback to MySkillsPlus",
  },
  openGraph: {
    ...METADATA.openGraph,
    title: "Friends Feedback",
    description: "Friends Feedback to MySkillsPlus",
    url: `${APP_URL}/auth/friends-feedback`,
  },
};

const FriendFeedback: React.FC = () => {
  return <FriendsFeedback />;
};

export default FriendFeedback;
