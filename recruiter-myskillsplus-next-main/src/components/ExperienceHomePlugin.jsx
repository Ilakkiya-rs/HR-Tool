"use client";

import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaUserCheck, FaSearch } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import BackgroundProfileForm from "@/components/JobBackgroundProfileForm";
import FindMatchProfile from "@/components/FindMatchProfile";
import JobSkillsProfile from "@/components/JobSkillsProfile";
import { useSearchParams } from "next/navigation";

const ExperienceHomePlugin = () => {
  const [jobs, setJobs] = useState([]);
  const [activeJob, setActiveJob] = useState(null);
  const [mode, setMode] = useState("table");
  const [jobTitleInput, setJobTitleInput] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const searchParams = useSearchParams();
  const [breadcrumb, setBreadcrumb] = useState(["Job Skills Profile"]);

  useEffect(() => {
    localStorage.setItem('iys', JSON.stringify({
      page: "Home",
      tap: "all",
      profile_view: "all",
      isEdit: true,
      isDelete: true,
      doughnt: true,
      experience: true
    }));
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("logedinUserDetail"));
    setUserDetails(user);
    if (user?.individual_profile_id) fetchJobs(user.individual_profile_id);
  }, []);

  useEffect(() => {
    const viewMatches = searchParams.get("viewMatches");
    const jobId = searchParams.get("jobId");
  
    if (viewMatches && jobId && jobs.length > 0) {
      const jobToOpen = jobs.find((j) => j.id.toString() === jobId);
      if (jobToOpen) {
        setActiveJob(jobToOpen);
        setMode("view-matches");
  
        //Clean the URL by removing query params
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    }
  }, [jobs, searchParams]);
  
  useEffect(() => {
    // Update breadcrumb based on mode
    const newBreadcrumb = ["Job Skills Profile"];
    if (mode === "add-job") {
      newBreadcrumb.push("Add Job");
    } else if (mode === "view-skills") {
      newBreadcrumb.push("View Job Skills");
    } else if (mode === "add-bg") {
      newBreadcrumb.push("Add JBP");
    } else if (mode === "edit-bg") {
      newBreadcrumb.push("Edit JBP");
    } else if (mode === "view-bg") {
      newBreadcrumb.push("View JBP");
    } else if (mode === "find-matches") {
      newBreadcrumb.push("Find Matching Profile");
    } else if (mode === "edit-matches") {
      newBreadcrumb.push("Edit Matching Profile");
    } else if (mode === "view-matches") {
      newBreadcrumb.push("Shortlisted Candidates");
    }
    setBreadcrumb(newBreadcrumb);
  }, [mode]);
  const fetchJobs = async (userId) => {
    // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/job-titles/${userId}`);
    const res = await fetch(`https://api.myskillsplus.com/job-titles/${userId}`);
    const data = await res.json();
    setJobs(data.job_profiles || []);
  };

  const handleBgProfile = (modeType, job) => {
    setActiveJob(job);
    setMode(`${modeType}-bg`);
  };  

  const handleFindMatch = (viewType, job) => {
    console.log("Mode Set:", `${viewType}-matches`, "For Job:", job);
    setActiveJob(job);
    setMode(`${viewType}-matches`);
  };  

  const handleSaveJobProfile = async () => {
    const skills = JSON.parse(localStorage.getItem("userRatedSkills"));
    const user = JSON.parse(localStorage.getItem("logedinUserDetail"));
    if (!skills) {
      alert('No skills found in local storage.');
      return;
    }
    if (!jobTitleInput.trim()) {
      alert('Please enter a job title.');
      return;
    }
    const payload = {
      job_title: jobTitleInput,
      user_id: user.individual_profile_id,
      user_name: `${user.first_name} ${user.last_name}`,
      user_email: user.email,
      userRatedSkills: skills,
    };

    // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/save-job-profile/`, {
    const res = await fetch("https://api.myskillsplus.com/save-job-profile/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("Job created!");
      localStorage.removeItem("userRatedSkills");
      fetchJobs(user.individual_profile_id);
      setMode("table");
    }
  };

  const handleBackToTable = () => {
    const user = JSON.parse(localStorage.getItem("logedinUserDetail"));
    if (user?.individual_profile_id) fetchJobs(user.individual_profile_id); // ← this ensures jobs are re-fetched
    localStorage.removeItem("userRatedSkills");
    setMode("table");
  };

  const handleJobSkillsProfile = (modeType, job) => {
    setActiveJob(job);
    setMode(modeType);
  };

  const handleBreadcrumbClick = (index) => {
    if (index === 0) {
      const user = JSON.parse(localStorage.getItem("logedinUserDetail"));
      if (user?.individual_profile_id) fetchJobs(user.individual_profile_id);
      localStorage.removeItem("userRatedSkills");
      setMode("table");
    }
  };

  return (
    <>
      {/* Breadcrumb */}
      <nav className="p-3 rounded mb-4">
        <ol className="flex space-x-2 text-lg text-[#757575]">
          {breadcrumb.map((crumb, index) => (
            <li key={index} className="flex items-center">
              <button
                onClick={() => handleBreadcrumbClick(index)}
                className={`hover:underline ${
                  index === breadcrumb.length - 1 ? " text-[#1a0dab] font-medium" : ""
                }`}
                disabled={index === breadcrumb.length - 1}
              >
                {crumb}
              </button>
              {index < breadcrumb.length - 1 && (
                <span className="mx-2 text-[#BDBDBD]">/</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      {mode !== "table" && (
        <>
          {/* <div className="text-sm text-gray-500 mb-2">
            Job Skills Profile &gt; {mode.includes("bg") ? "Background Profile" : "Find Match"}
          </div> */}
          <div className="justify-end items-center mb-6 hidden">
            <button className="text-blue-600" onClick={() => handleBackToTable()}>
              ← Back to Job List
            </button>
          </div>
        </>
      )}

      {mode === "table" && (
        <>
          <div className="flex justify-end items-center mb-4">
            <button
              type="button"
              className="px-4 py-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 text-sm"
              onClick={() => setMode("add-job")}
            >
              + Add Job
            </button>
          </div>
          {jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8">
              <img src="/images/logo/no-data.png" alt="No Data" className="w-48 mb-4" />
              <h3 className="font-semibold text-black text-lg mb-2">No job profiles created yet</h3>
              <p className="text-gray-500 text-sm mb-4">Start by creating your first job profile using the Add Job button.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl shadow border border-gray-200">
              <table className="min-w-full text-sm text-center">
                <thead className="bg-black text-white">
                  <tr>
                    <th className="p-3 text-left font-semibold">Job Title</th>
                    <th className="p-3 font-semibold">Job Skills</th>
                    <th className="p-3 font-semibold">Job Background Profile</th>
                    <th className="p-3 font-semibold">Find Match</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {jobs.map((job, idx) => (
                    <tr
                      key={job.id}
                      className={`hover:bg-gray-100 transition-all ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                    >
                      <td className="p-3 text-left font-medium text-gray-800">{job.job_title}</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleJobSkillsProfile("view-skills", job)}
                          className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
                        >
                          View Skills
                        </button>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-4">
                          {/* Add icon - shown only if background is NOT added */}
                          {!job.has_background_details ? (
                            <FaCirclePlus  
                              onClick={() => handleBgProfile("add", job)}
                              className="text-gray-600 hover:text-gray-800 cursor-pointer transition"
                              title="Add Background"
                            />
                          ) : (
                            <FaCirclePlus 
                              className="text-gray-300 cursor-not-allowed" 
                              title="Already Added" 
                            />
                          )}

                          {/* Edit icon - enabled only if background exists */}
                          <FaEdit
                            onClick={job.has_background_details ? () => handleBgProfile("edit", job) : undefined}
                            className={`transition ${
                              job.has_background_details
                                ? "text-blue-600 hover:text-blue-800 cursor-pointer"
                                : "text-gray-300 cursor-not-allowed"
                            }`}
                            title="Edit Background"
                          />

                          {/* View icon - enabled only if background exists */}
                          <FaEye
                            onClick={job.has_background_details ? () => handleBgProfile("view", job) : undefined}
                            className={`transition ${
                              job.has_background_details
                                ? "text-green-600 hover:text-green-800 cursor-pointer"
                                : "text-gray-300 cursor-not-allowed"
                            }`}
                            title="View Background"
                          />
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-4">
                          {/* Find Matches */}
                          <FaSearch
                            onClick={job.is_short_listed ? undefined :() => handleFindMatch("find", job)}
                            className={`transition ${
                              job.is_short_listed
                                ? "text-gray-300 cursor-not-allowed"
                                : "text-blue-600 hover:text-blue-800 cursor-pointer"
                            }`}
                            title="Find Matches"
                          />

                          {/* Re-filter */}
                          <FaEdit
                            onClick={job.is_short_listed ? () => handleFindMatch("edit", job) : undefined}
                            className={`transition ${
                              job.is_short_listed
                                ? "text-blue-600 hover:text-blue-800 cursor-pointer"
                                : "text-gray-300 cursor-not-allowed"
                            }`}
                            title="Re-filter"
                          />

                          {/* View Shortlisted */}
                          <FaUserCheck
                            onClick={job.is_short_listed ? () => handleFindMatch("view", job) : undefined}
                            className={`transition ${
                              job.is_short_listed
                                ? "text-green-600 hover:text-green-800 cursor-pointer"
                                : "text-gray-300 cursor-not-allowed"
                            }`}
                            title="View Shortlisted"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {mode === "add-job" && (
        <>
          <div className="job-title mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-gray-800 text-lg font-semibold">Job Title</h2>
              <div className="flex gap-4">
                <button type="button" onClick={() => setMode("table")} className="px-5 py-1 rounded-full border border-gray-400 text-gray-600 hover:bg-gray-100 text-sm">
                    Cancel
                </button>
                <button type="button" onClick={handleSaveJobProfile} className="px-5 py-1 rounded-full bg-blue-600 text-white hover:bg-blue-700 text-sm">
                    Save Job
                </button>
              </div>
            </div>
            <div className="flex border border-[#D1D5DB] rounded-lg overflow-hidden">
              <input
                type="text"
                className="p-2 text-md w-full focus:outline-none"
                placeholder="Enter your job title"
                value={jobTitleInput}
                onChange={(e) => setJobTitleInput(e.target.value)}
              />
            </div>
          </div>
          <iframe
            src="/plugins/allinone/index.html"
            title="Skills Profiler"
            style={{ width: "100%", height: "78vh", borderRadius: "10px" }}
          />
        </>
      )}

      {mode === "view-skills" ? (
        <JobSkillsProfile
          activeJob={activeJob}
          user={userDetails}
        />
      ) : null}

      {mode === "view-bg" || mode === "edit-bg" || mode === "add-bg" ? (
        <BackgroundProfileForm
          activeJob={activeJob}
          mode={mode}
          onBack={handleBackToTable}
        />
      ) : null}

      {/* {mode === "view-matches" || mode === "edit-matches" || mode === "find-matches" ? (
        <FindMatchProfile
          activeJob={activeJob}
          mode={mode}
          onBack={handleBackToTable}
          onShortlistComplete={() => setMode("view-matches")}
        />
      ) : null} */}
      {mode === "view-matches" || mode === "edit-matches" || mode === "find-matches" ? (
        <FindMatchProfile
          key={`${activeJob?.id}-${mode}`} // ← force re-render when mode or job changes
          activeJob={activeJob}
          mode={mode}
          onBack={handleBackToTable}
          onShortlistComplete={() => setMode("view-matches")}
        />
      ) : null}

    </>
  );
};

export default ExperienceHomePlugin;
