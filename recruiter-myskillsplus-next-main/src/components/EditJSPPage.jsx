"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import JSPBreadcrumb from "@/components/JSPBreadcrumb";

const EditJSPPage = ({ jobId, jobTitle }) => {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [jobTitleInput, setJobTitleInput] = useState(jobTitle || "");
  const router = useRouter();

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
        page: "editJsp",
        tap: "profile",
        profile_view: "all",
        isEdit: true,
        isDelete: true,
        doughnt: true,
        experience: true,
      })
    );
  }, [jobId]);

  const handleUpdateJobProfile = async () => {
    const skills = JSON.parse(localStorage.getItem("userRatedSkills"));
    if (!skills) {
      alert('No skills found in local storage.');
      return;
    }
    if (!jobTitleInput.trim()) {
      alert('Please enter a job title.');
      return;
    }
    const payload = {
      job_id: jobId,
      job_title: jobTitleInput,
      userRatedSkills: skills,
    };

    // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/update-job-profile/`, {
    const res = await fetch("https://api.myskillsplus.com/update-job-profile/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
        alert("Job skills Updated!");
        localStorage.removeItem("userRatedSkills");
        router.push("/jsp-profile");
    } else {
        alert("Failed to Update job skills.");
    }
  };

  return (
    <>
        <JSPBreadcrumb
            items={[
                { label: "Job Skills Profile", href: "/jsp-profile" },
                { label: "Edit Jsp" },
            ]}
        />
        <div className="mx-auto px-4 sm:px-6 lg:px-4 py-6">
            <div className="bg-white rounded-xl shadow p-6 mb-6">
                <div className="flex justify-between items-center mb-4 flex-col sm:flex-row gap-4">
                    <h2 className="text-gray-800 text-lg font-semibold w-full sm:w-auto">Job Title</h2>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={() => router.push('/jsp-profile')}
                            className="px-4 py-1 rounded-full border border-gray-400 text-gray-600 hover:bg-gray-100 text-sm w-full sm:w-auto"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleUpdateJobProfile}
                            className="px-4 py-1 rounded-full bg-blue-600 text-white hover:bg-blue-700 text-sm w-full sm:w-auto"
                        >
                            Update Job
                        </button>
                    </div>
                </div>

                <input
                    type="text"
                    className="p-2 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-md"
                    placeholder="Enter your job title"
                    value={jobTitleInput}
                    onChange={(e) => setJobTitleInput(e.target.value)}
                    disabled
                />
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
        </div>
    </>
  );
};

export default EditJSPPage;