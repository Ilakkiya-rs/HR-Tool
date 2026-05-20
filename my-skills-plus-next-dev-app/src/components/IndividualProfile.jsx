'use client';

import { useEffect, useState } from 'react';
import Link from "next/link";

const IndividualProfile = ({ initialProfile }) => {
    const [profile, setProfile] = useState(initialProfile);
    useEffect(() => {
        setProfile(initialProfile);

        if (initialProfile?.skills_profile?.length > 0) {
            localStorage.setItem("userRatedSkills", JSON.stringify(initialProfile.skills_profile));
        }

        localStorage.setItem('iys', JSON.stringify({
            page: "Individual_profile",
            tap: "profile",
            profile_view: "all",
            isEdit: false,
            isDelete: false,
            doughnt: true,
            experience: true
        }));
    }, [initialProfile]);

    const workPreference = profile?.workpreference;
    const vspCost = profile?.vsp_details?.vspCost || 'N/A';
    const vspCurrency = profile?.vsp_details?.vspCurrency || 'USD';
    const pbpFee = profile?.vsp_details?.pbpFee || 'N/A';
    const pbpCurrency = profile?.vsp_details?.pbpCurrency || 'USD';
    const pcpFee = profile?.vsp_details?.pcpFee || 'N/A';
    const pcpCurrency = profile?.vsp_details?.pcpCurrency || 'USD';

    if (!profile) return <div>Loading...</div>;

    return (
      <div className="bg-[#EFF4FA] text-black">
        <div className="container mx-auto p-6">
            <div className="flex w-full items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                    <img width={32} height={32} src="/images/logo/myskillspluslogo.png" alt="Logo" />
                    <b className="text-xl text-black">MySkillsPlus</b>
                </div>
                <button
                    className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700 transition"
                    onClick={() => {
                        const profileId = profile.individual_profile_id;
                        const contactUrl = `https://job.myskillsplus.com/auth/signin?contactId=${profileId}`;
                        window.open(contactUrl, "_blank");
                    }}
                >
                    Contact
                </button>
            </div>
            <div className="mb-6 bg-white p-4 rounded-2xl text-center">
                <h1 className="text-2xl font-bold">My Skills Profile</h1>
                <p className="text-[#285192] font-bold text-lg">
                    (Profile Id - {profile.individual_profile_id})
                </p>
            </div>
            {/* work-preference */}
            <div className="space-y-6 mb-6">
                <div className="p-4 bg-white shadow rounded-2xl text-[#24303F]">
                    <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-4">
                        {/* Work Interest */}
                        <div className="p-4 border border-[#D3D9E2] rounded-xl">
                            <h2 className="text-lg font-semibold mb-2">Work Interest</h2>
                            <span className="text-sm">{workPreference?.workInterest || "N/A"}</span>
                            {/* Freelance / Project Basis */}
                            <h3 className="font-semibold mb-2 mt-4">Freelance / Project Opportunities</h3>
                            {workPreference?.freelanceInterest === "Not Interested" ? (
                                <span className="text-sm">Not Interested</span>
                            ) : (
                                <div className="mb-2 space-y-4">
                                    <div className="grid md:grid-cols-2">
                                        {/* Weekday Freelance Option */}
                                        {workPreference?.freelanceOptions?.weekday?.selected && (
                                            <div>
                                                <h4 className="text-sm font-semibold mb-1">Weekday</h4>
                                                <span className="text-sm">{workPreference.freelanceOptions.weekday.hours} hours</span>
                                            </div>
                                        )}
                                        {/* Weekend Freelance Option */}
                                        {workPreference?.freelanceOptions?.weekend?.selected && (
                                            <div>
                                                <h4 className="text-sm font-semibold mb-1">Weekend</h4>
                                                <span className="text-sm">{workPreference.freelanceOptions.weekend.hours} hours</span>
                                            </div>
                                        )}
                                    </div>
                                    {/* If neither selected, show N/A */}
                                    {!workPreference?.freelanceOptions?.weekday?.selected && 
                                    !workPreference?.freelanceOptions?.weekend?.selected && (
                                    <span>Not Interested</span>
                                    )}
                                </div>
                            )}
                        </div>
                        {/* Workplace Preference */}
                        <div className="border border-[#D3D9E2] rounded-xl p-4">
                            <div className="grid grid-cols-1">
                                <div>
                                    <h3 className="font-semibold mb-2">Workplace Preference</h3>
                                    <div className="flex flex-row gap-10 mb-4 text-sm">
                                    <span>
                                        {workPreference?.employmentType === "Any"
                                        ? "Any (WFH or WFO)"
                                        : workPreference?.employmentType || "N/A"}
                                    </span>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2">
                                {/* Current Location */}
                                <div className="mb-4">
                                    <h3 className="text-sm font-semibold mb-2">Current location</h3>
                                    <span className="text-sm">
                                        {[workPreference?.cityName, workPreference?.stateName, workPreference?.countryName]
                                            .filter(Boolean)
                                            .join(', ')
                                        }
                                    </span>
                                </div>
                                <div className="mb-2">
                                    <h3 className="text-sm font-semibold mb-2">Willing to relocate?</h3>
                                    <span>{workPreference?.willingToRelocate || "N/A"}</span>
                                </div>
                            </div>
                            {/* Willing to Relocate */}
                            <div className="mb-2">
                                <div className="grid grid-cols-1">
                                    {/* If willing to relocate is "Yes", show relocation places */}
                                    {workPreference?.willingToRelocate === "Yes" && (
                                    <div>
                                        <h3 className="text-sm font-semibold mb-2">Where are you open to moving?</h3>
                                        {Array.isArray(workPreference?.relocationPreference) ? (
                                        <ul className="list-decimal list-inside text-sm space-y-1">
                                            {workPreference.relocationPreference.map((place, index) => (
                                            <li key={index}>{place}</li>
                                            ))}
                                        </ul>
                                        ) : (
                                        <span className="text-sm">{workPreference?.relocationPreference || "N/A"}</span>
                                        )}
                                    </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* VSP and Others */}
            <div className="space-y-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 text-sm">
                    {/* VSP */}
                    <div className="p-4 rounded-2xl bg-white text-[#24303F]">
                        <h2 className="text-lg font-semibold mb-4">VSP (Value of Skills Profile)</h2>
                        <h2 className="text-base font-medium mb-3 text-[#8F9AAA]">Per-hour rate for work</h2>
                        <span className="font-semibold">{vspCost} {vspCurrency === 'USD' ? '$' : '₹'}</span>
                    </div>
        
                    {/* PBP */}
                    <div className="p-4 rounded-2xl bg-white text-[#24303F]">
                        <h2 className="text-lg font-semibold mb-4">BVF( Background View Fee)</h2>
                        <h2 className="text-base font-medium mb-3 text-[#8F9AAA]">Fee to view profile background</h2>
                        <span className="font-semibold">{pbpFee} {pbpCurrency === 'USD' ? '$' : '₹'}</span>
                    </div>
        
                    {/* PCP */}
                    <div className="p-4 rounded-2xl bg-white text-[#24303F]">
                        <h2 className="text-lg font-semibold mb-4">PCF (Person Contact Fee)</h2>
                        <h2 className="text-base font-medium mb-3 text-[#8F9AAA]">Fee to access contact details</h2>
                        <span className="font-semibold">{pcpFee} {pcpCurrency === 'USD' ? '$' : '₹'}</span>
                    </div>
                </div>
            </div>
            {/* Skills Profile */}
            <section id="experience-plugin-section">
            <div className="container mx-auto">
                <div className="d-flex flex-column align-items-center justify-content-between">
                    <div className="col-12" style={{ height: "78vh" }}>
                        {/* Auth / No-Auth */}
                        <iframe
                        style={{ borderRadius: "10px", height: "100%", width: "100%" }}
                        src="/plugins/allinone/index.html"
                        title="IYS Plugin Rating"
                        />
                    </div>
                </div>
            </div>
            </section>
        </div>
      </div>
    );
}
export default IndividualProfile;