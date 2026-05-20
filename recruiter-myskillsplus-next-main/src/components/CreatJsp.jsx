"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import JSPBreadcrumb from "@/components/JSPBreadcrumb";
import Loader from "./common/Loader";

const CreateJobProfile = () => {
  const [jobTitleInput, setJobTitleInput] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    localStorage.setItem('iys', JSON.stringify({
      page: "Home",
      tap: "all",
      profile_view: "all",
      isEdit: true,
      isDelete: true,
      doughnt: true,
      experience: true,
      save_button: false
    }));
  }, []);

  const handleSaveJobProfile = async () => {
    const skills = JSON.parse(localStorage.getItem("userRatedSkills"));
    const user = JSON.parse(localStorage.getItem("logedinUserDetail"));

    if (!skills) {
      alert("No skills found in local storage.");
      return;
    }

    if (!jobTitleInput.trim()) {
      alert("Please enter a job title.");
      return;
    }

    if (!user.individual_profile_id) {
      return;
    }

    try {
      const skillsList = (skills || [])
        .map(item => item?.isot_file?.name)
        .filter(Boolean);

      const skillsStr = skillsList.join(", ");

      const skillWord = skillsList.length === 1 ? "skill" : "skills";

      const jobDescription = `We are seeking a skilled ${jobTitleInput} with strong ${skillWord} in ${skillsStr}. The ideal candidate will deliver high-quality work and collaborate effectively.`;

      // 🔹 STEP 1: Generate Assessment
      const jobDetails = {
        recruiter_id: user.individual_profile_id,
        job_title: jobTitleInput,
        job_description: jobDescription,
      };

      setLoading(true);

      const res1 = await fetch(
        `https://api.myskillsplus.com/jobfit/generate-assessment/`,
        // `${process.env.NEXT_PUBLIC_BASE_URL}/jobfit/generate-assessment/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jobDetails),
        }
      );

      const data1 = await res1.json();

      if (!res1.ok) {
        alert(`Assessment failed: ${data1?.error || "Unknown error"}`);
        return;
      }

      // 🔹 STEP 2: Save Job Profile
      const payload = {
        job_title: jobTitleInput,
        user_id: user.individual_profile_id,
        user_name: `${user.first_name} ${user.last_name}`,
        user_email: user.email,
        userRatedSkills: skills,
      };

      const res2 = await fetch(
        `https://api.myskillsplus.com/save-job-profile/`,
        // `${process.env.NEXT_PUBLIC_BASE_URL}/save-job-profile/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (res2.ok) {
        alert("Job created!");
        localStorage.removeItem("userRatedSkills");
        router.push("/jsp-profile");
      } else {
        alert("Failed to create job.");
      }

    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <JSPBreadcrumb
        items={[
          { label: "Job Skills Profile", href: "/jsp-profile" },
          { label: "Create Jsp" },
        ]}
      />
      {loading ?
        <Loader /> :
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
                  onClick={handleSaveJobProfile}
                  className="px-4 py-1 rounded-full bg-blue-600 text-white hover:bg-blue-700 text-sm w-full sm:w-auto"
                >
                  Save Job
                </button>
              </div>
            </div>

            <input
              type="text"
              className="p-2 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-md"
              placeholder="Enter your job title"
              value={jobTitleInput}
              onChange={(e) => setJobTitleInput(e.target.value)}
            />
          </div>
          <iframe
            src="/plugins/allinone/index.html"
            title="Skills Profiler"
            style={{ width: "100%", height: "78vh", borderRadius: "10px" }}
          />
        </div>
      }
    </>
  );
};

export default CreateJobProfile;