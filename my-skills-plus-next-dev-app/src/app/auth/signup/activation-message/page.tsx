import React from "react";
import Link from "next/link";
import Image from "next/image";
import { APP_URL, METADATA } from "@/common/seo";

export const metadata = {
    ...METADATA,
    title: "Activate Account",
    description: "Activate Account to MySkillsPlus",
    alternates: {
      canonical: `${APP_URL}/auth/signup/activation-message`,
    },
    twitter: {
        ...METADATA.twitter,
        title: "Activate Account",
        description: "Activate Account to MySkillsPlus",
    },
    openGraph: {
        ...METADATA.openGraph,
        title: "Activate Account",
        description: "Activate Account to MySkillsPlus",
        url: `${APP_URL}/auth/signup/activation-message`,
    },
};
const ActivationPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
        <div className="h-110 w-95 p-8 rounded-lg shadow-md border border-gray-200 mb-4">
            <h1 className="text-2xl font-semibold mb-6 text-center">Activation Email Sent</h1>
            <Link className="mb-6 flex justify-center" href="/">
                <Image
                    src={"/images/Infographic-10.svg"}
                    alt="Logo"
                    width={100}
                    height={32}
                    style={{ width: "70%" }}
                />
            </Link>
            <p className="text-gray-600 mb-5 text-lg text-center">Activation link has been sent to your email. Please click on the Link to activate your account.</p>
            <p className="text-gray-600 text-center text-lg"><Link href="/auth/signup" className="text-blue-700">Go back</Link></p>
        </div>
        <div className="w-95 p-6 rounded-lg shadow-md border border-gray-200">
            <p className="text-gray-600 text-lg text-center">Have an account? Go to <Link href="/auth/signin" className="text-blue-700 text-lg">SignIn</Link></p>
        </div>
    </div>
  );
};

export default ActivationPage;
