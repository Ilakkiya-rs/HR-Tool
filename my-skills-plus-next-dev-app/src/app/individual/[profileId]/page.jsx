import { APP_URL, METADATA } from "@/common/seo";
import IndividualProfile from "@/components/IndividualProfile";

export const metadata = {
  ...METADATA,
  title: "Individual Profile",
  description: "Detailed individual profile on MySkillsPlus",
  alternates: {
    canonical: `${APP_URL}/individual`,
  },
  twitter: {
    ...METADATA.twitter,
    title: "Individual Profile",
    description: "Detailed profile",
  },
  openGraph: {
    ...METADATA.openGraph,
    title: "Individual Profile",
    description: "Detailed profile",
    url: `${APP_URL}/individual`,
  },
};

async function IndividualProfilePage ({ params }){
  const { profileId } = params;

  const res = await fetch(`https://api.myskillsplus.com/users/individual-profile-details/${profileId}/`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <p className="text-gray-600 text-lg font-medium">Profile not found</p>
      </div>
    );
  }

  const data = await res.json();

  if (!data.skills_profile || data.skills_profile.length === 0) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <p className="text-gray-600 text-lg font-medium">
          Profile is not prepared yet
        </p>
      </div>
    );
  }

  return <IndividualProfile initialProfile={data} />;
}
export default IndividualProfilePage;