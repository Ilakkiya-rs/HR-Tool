"use client";

import React, { useState,useEffect } from "react";
import { useSearchParams } from "next/navigation";

const JobSkillsProfile = () => {
  const searchParams = useSearchParams();
  const [jobTitle, setJobTitle] = useState('');
  const [vspCost, setVspCost] = useState('');
  const [vspCurrency, setVspCurrency] = useState('USD');
  const [workPreference, setWorkPreference] = useState({
    employmentType: "",
    state: "",
    stateName: "",
    city: "",
    cityName: "",
    country: "",
    countryName: "",
    freelanceOptions: {
      weekday: { selected: false, hours: "" },
      weekend: { selected: false, hours: "" },
    },
  });
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [workDescription, setWorkDescription] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Extract recruiterId and jobId from query parameters
    const recruiterId = searchParams.get("recruiterId");
    const jobId = searchParams.get("jobId");

    const fetchWorkPreference = async () => {
      if (!recruiterId || !jobId) {
        console.error("Missing recruiterId or jobId in query parameters");
        return;
      }
      try {
        setLoading(true);
        // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/retrieve-job-background-details/${recruiterId}/${jobId}`);
        const res = await fetch(`https://api.myskillsplus.com/retrieve-job-background-details/${recruiterId}/${jobId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data?.background_details) {
          setJobTitle(data.job_title);
          setWorkPreference(data.background_details.workPreference);
          setVspCost(data.background_details.vsp_cost);
          setVspCurrency(data.background_details.vsp_currency);
          setCompanyName(data.background_details.company_name);
          setCompanyWebsite(data.background_details.company_website);
          setCompanyDescription(data.background_details.company_description);
          setWorkDescription(data.background_details.work_description);
        }
      } catch (err) {
        console.error("Profile fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchWorkPreference();
  }, [searchParams]);

  return loading ? (
    <p>Loading...</p>
  ) : (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Job Background Profile</h1>
      <div className="space-y-6 justify-center items-center">
            {/* Payment Terms */}
            <div className="p-4 rounded-2xl bg-white text-[#24303F]">
              <h2 className="text-lg font-semibold mb-4">Payment Terms</h2>
              <div className="flex lg:flex-row md:flex-row flex-col lg:gap-20 text-sm">
                <div className="job-title lg:mb-0 md:mb-3 mb-3">
                  <h2 className="text-sm font-semibold lg:mb-3 mb-2">Job Title</h2>
                  <span className="font-medium text-sm">{jobTitle || "N/A"}</span>
                </div>
                <div className="vsp-cost">
                  <h2 className="text-sm font-semibold lg:mb-3 mb-2">Value of Skills Profile</h2>
                  <span className="font-medium text-sm">{vspCost} {vspCurrency === 'USD' ? '$' : '₹'}</span>
                </div>
              </div>
            </div>
            {/* Workplace Preference */}
            <div className="p-4 bg-white shadow rounded-2xl text-[#24303F]">
                <h2 className="text-lg font-semibold mb-4">Workplace Preference</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Full-time employment */}
                    <div className="border border-[#D3D9E2] rounded-xl p-4">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold mb-2">Full-time Employment</h3>
                                <div className="flex flex-row gap-10 mb-4 text-sm">
                                    <span>{workPreference?.employmentType || "N/A"}</span>
                                </div>
                            </div>
                            {/* Current Location */}
                            <div className="mb-2">
                                <h3 className="text-sm font-semibold mb-2">Where are you currently located?</h3>
                                <span className="text-sm">
                                    {[workPreference?.cityName, workPreference?.stateName, workPreference?.countryName]
                                        .filter(Boolean)
                                        .join(', ')
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Freelance / Project Basis */}
                    <div className="border border-[#D3D9E2] rounded-xl p-4">
                        <h3 className="font-semibold mb-4">Freelance / Project Basis</h3>
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
                            <span>N/A</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Company Profile */}
            <div className="p-4 rounded-2xl bg-white text-[#24303F]">
              <h2 className="text-lg font-semibold mb-4">Company Profile</h2>
              <div className="flex lg:flex-row md:flex-row flex-col lg:gap-10 text-sm mb-4">
                <div className="job-title lg:mb-0 md:mb-3 mb-3">
                  <h2 className="text-sm font-semibold lg:mb-3 mb-2">Name of Company</h2>
                  <span className="text-sm">{companyName || "N/A"}</span>
                </div>
                <div className="vsp-cost">
                  <h2 className="text-sm font-semibold lg:mb-3 mb-2">Website of Company</h2>
                  <span className="text-sm">{companyWebsite}</span>
                </div>
              </div>
              <div className="flex flex-row gap-4 text-sm mb-4">
                <div className="job-title">
                  <h2 className="text-sm font-semibold mb-3">Description of Company</h2>
                  <span className="text-sm">{companyDescription || "N/A"}</span>
                </div>
              </div>
              <div className="flex flex-row gap-4 text-sm mb-4">
                <div className="job-title">
                  <h2 className="text-sm font-semibold mb-3">Description of Work</h2>
                  <span className="text-sm">{workDescription || "N/A"}</span>
                </div>
              </div>
            </div>
      </div>
    </div>
  );
};

export default JobSkillsProfile;