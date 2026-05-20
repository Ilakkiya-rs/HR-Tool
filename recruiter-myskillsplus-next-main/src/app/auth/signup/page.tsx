import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Register from "@/components/Authforms/Register";
import { APP_URL, METADATA } from "@/common/seo";

export const metadata = {
  ...METADATA,
  title: "Sign Up",
  description: "Sign Up to MySkillsPlus",
  alternates: {
    canonical: `${APP_URL}/auth/signup`,
  },
  twitter: {
    ...METADATA.twitter,
    title: "Sign Up",
    description: "Sign Up to MySkillsPlus",
  },
  openGraph: {
    ...METADATA.openGraph,
    title: "Sign Up",
    description: "Sign Up to MySkillsPlus",
    url: `${APP_URL}/auth/signup`,
  },
};

const SignUp: React.FC = () => {
  return <Register />;
};

export default SignUp;
