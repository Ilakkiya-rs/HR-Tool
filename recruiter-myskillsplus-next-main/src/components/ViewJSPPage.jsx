"use client";

import React, { useEffect, useState } from "react";
import JSPBreadcrumb from "@/components/JSPBreadcrumb";
import { FaGraduationCap } from "react-icons/fa";

const ViewJSPPage = ({ jobId, jobTitle }) => {
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("logedinUserDetail"));

    if (!user || !jobId) return;

    const fetchSkills = async () => {
      try {
        const res = await fetch(
          // `${process.env.NEXT_PUBLIC_BASE_URL}/get-user-rated-skills/${user.individual_profile_id}/${jobId}`
          `https://api.myskillsplus.com/get-user-rated-skills/${user.individual_profile_id}/${jobId}`
        );
        if (!res.ok) throw new Error("Failed to fetch skills");

        const data = await res.json();
        localStorage.setItem("userRatedSkills", JSON.stringify(data));
        setIsDataLoaded(true);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    fetchSkills();

    localStorage.setItem(
      "iys",
      JSON.stringify({
        page: "Home",
        tap: "profile",
        profile_view: "all",
        isEdit: false,
        isDelete: false,
        doughnt: true,
        experience: true,
        save_button: false
      })
    );
  }, [jobId]);

  return (
    <>
        <JSPBreadcrumb
            items={[
                { label: "Job Skills Profile", href: "/jsp-profile" },
                { label: "View Jsp" },
            ]}
        />
        <section id="experience-plugin-section" className="bg-white rounded-lg p-4">
            <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 border-b-2 border-[#EEEEEE]">
                <h2 className="text-lg sm:text-xl font-semibold text-[#3f51b5] flex items-center gap-2">
                    <FaGraduationCap className="text-xl" />
                    {jobTitle} (JSP)
                </h2>
            </div>
            {isDataLoaded ? (
                <iframe
                    src="/plugins/allinone/index.html"
                    title="Skills Profiler"
                    style={{ width: "100%", height: "78vh", borderRadius: "10px" }}
                />
            ) : (
                <p>Loading skills data...</p>
            )}
        </section>
    </>
  );
};

export default ViewJSPPage;