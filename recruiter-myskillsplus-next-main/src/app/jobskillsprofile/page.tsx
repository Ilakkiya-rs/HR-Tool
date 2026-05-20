"use client";

import React, { useState,useEffect } from "react";
import { useSearchParams } from "next/navigation";

const JobSkillsProfile = () => {
  const searchParams = useSearchParams();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  useEffect(() => {
    // Extract recruiterId and jobId from query parameters
    const recruiterId = searchParams.get("recruiterId");
    const jobId = searchParams.get("jobId");

    const fetchSkills = async () => {
      if (!recruiterId || !jobId) {
        console.error("Missing recruiterId or jobId in query parameters");
        return;
      }

      try {
        const res = await fetch(`https://api.myskillsplus.com/get-user-rated-skills/${recruiterId}/${jobId}`);
        // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/get-user-rated-skills/${recruiterId}/${jobId}`);
        if (!res.ok) throw new Error("Failed to fetch skills");
        const data = await res.json();
        localStorage.setItem("userRatedSkills", JSON.stringify(data));
        console.log("Skills fetched and stored in localStorage:", data);
        setIsDataLoaded(true);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    fetchSkills();

    localStorage.setItem("iys", JSON.stringify({
      page: "Home",
      tap: "profile",
      profile_view: "all",
      isEdit: false,
      isDelete: false,
      doughnt: true,
      experience: true,
    }));
  }, [searchParams]);

  return (
    <div className="container mx-auto p-6">
      <section id="experience-plugin-section">
        <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">
        <h2 className="text-2xl text-black font-medium">
          Job Skills Profile - <span className="text-black font-bold">{searchParams.get("jobTitle")}</span> (Job Profile ID - <span className="text-black font-bold">{searchParams.get("jobId")}</span>)
        </h2>
        </h2>
        </div>
        <div className="d-flex flex-column align-items-center justify-content-between">
          <div className="col-12" style={{ height: "100vh" }}>
            {isDataLoaded ? (
              <iframe
                style={{ borderRadius: "10px", height: "100%", width: "100%" }}
                src="/plugins/allinone/index.html"
                title="IYS Plugin Rating"
              />
            ) : (
              <p>Loading skills data...</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default JobSkillsProfile;