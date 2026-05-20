"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function ReferralHandler() {
  const router = useRouter();
  const params = useParams();
  const referralCode = params.code as string;
  const partnerIdFromUrl = params.partnerid as string;

  useEffect(() => {
    if (referralCode) {
      const targetUrl = process.env.NEXT_PUBLIC_EXTERNAL_REDIRECT_URL;
      if (!targetUrl) {
        console.error("NEXT_PUBLIC_EXTERNAL_REDIRECT_URL is not defined");
        return;
      }
      const url = new URL(targetUrl);
      
      url.searchParams.set("referralCode", referralCode);
      url.searchParams.set("partnerId", partnerIdFromUrl);

      window.location.href = url.toString();
    }
  }, [referralCode, router]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-[#757575]">Processing referral link...</p>
      </div>
    </div>
  );
}