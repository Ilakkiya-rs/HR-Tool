"use client";
import React, { useState, useEffect } from "react";

const ApplyJobPage = ({ jobId, jobTitle }) => {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const fetchRatedSkills = async () => {
      try {
        const res = await fetch(`https://api.myskillsplus.com/get-job-rated-skills/${jobId}/`);
        // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/get-job-rated-skills/${jobId}/`);
        if (!res.ok) throw new Error("Failed to fetch rated skills");

        const data = await res.json();

        // reset ratings/comments
        data.forEach((item) => {
          const ratingsLength = item.rating?.length || 0;
          item.comment = "";
          item.rating?.forEach((rating) => {
            if (ratingsLength === 1 && rating.isot_rating_id === "ratings/3") {
              rating.rating = 0;
              rating.comment = "";
            } else if (ratingsLength === 2 || ratingsLength === 1) {
              rating.rating = 0;
              rating.comment = "";
            }
          });
        });

        localStorage.setItem("userRatedSkills", JSON.stringify(data));
        setIsDataLoaded(true);
      } catch (error) {
        console.error("Error fetching rated skills:", error);
      }
    };

    fetchRatedSkills();

    localStorage.setItem(
      "iys",
      JSON.stringify({
        page: "editJsp",
        tap: "profile",
        profile_view: "all",
        isEdit: false,
        isDelete: false,
        doughnt: true,
        experience: true,
      })
    );
  }, [jobId]);

  const handleApplyAndTakeAssessment = async () => {
    const skills = JSON.parse(localStorage.getItem("userRatedSkills") || "[]");
    const recruiterDetails = JSON.parse(localStorage.getItem("logedinUserDetail"));

    const anySkillRated = skills.some((skill) => {
      const ratingsArray = skill.rating;
      return Array.isArray(ratingsArray) &&
        ratingsArray.some((r) => r.rating && r.rating !== 0 && r.rating !== "");
    });

    if (!anySkillRated) {
      alert("Please rate at least one skill before proceeding.");
      return;
    }

    try {
      const params = new URLSearchParams({
        job_id: jobId,
        job_title: jobTitle,
      });

      const res = await fetch(
        `https://api.myskillsplus.com/jobfit/fetch-interview-link/?${params.toString()}`,
        // `${process.env.NEXT_PUBLIC_BASE_URL}/jobfit/fetch-interview-link/?${params.toString()}`,
        {
          method: "GET",
        }
      );


      const data = await res.json();

      if (!res.ok) {
        alert(data?.error || "Failed to get assessment link");
        return;
      }

      const interviewLink = data.link;

      if (!interviewLink) {
        alert("No interview link received.");
        return;
      }

      // 🔹 Open new tab with backend-generated link
      const newWindow = window.open(interviewLink, "_blank");

      const skills = JSON.parse(localStorage.getItem("userRatedSkills") || "[]");

      let interviewOrigin;
      try {
        interviewOrigin = new URL(interviewLink).origin;
      } catch {
        interviewOrigin = "https://vani.myskillsplus.com";
      }

     const handler = (event) => {
      if (event.origin !== interviewOrigin) return;

      if (event.data === "READY") {
        newWindow.postMessage({ skills }, interviewOrigin);
      
        window.removeEventListener("message", handler);
      }
    };

window.addEventListener("message", handler);

      setFormSubmitted(true);

    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <>
      {formSubmitted ? (
        // ✅ Thank you screen
        <div className="flex items-center justify-center h-screen bg-white">
          <div className="text-center px-6">
            <h3 className="text-2xl font-bold text-green-600 mb-2">
              🎉 Thank You for applying!
            </h3>
            <p className="text-md text-gray-600">
              Once You complete the assessment our application has been submitted successfully.
            </p>
          </div>
        </div>
      ) : (
        <div className="container mx-auto bg-white px-4 py-6 sm:px-6 lg:px-8 w-full max-w-7xl rounded-xl shadow-md lg:my-5">
          <div className="flex items-center justify-between mb-4 border-b-2 border-[#EEEEEE] pb-2">
            <h3 className="text-[#3f51b5] text-2xl font-bold">
              Apply Job for {jobTitle}
            </h3>
            <button
              onClick={handleApplyAndTakeAssessment}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              Apply & Take Assessment
            </button>
          </div>

          <div className="mb-4 bg-[#f9f9f9] p-[15px] border-l-4 border-[#13829d] text-black font-md">
            <p>
              Review your skills and use the Star button to update your
              proficiency levels, along with any relevant comments for each
              skill.
            </p>
          </div>

          {isDataLoaded ? (
            <iframe
              src="/plugins/allinone/index.html"
              title="Skills Profiler"
              style={{ width: "100%", height: "78vh", borderRadius: "10px" }}
              className="mt-6"
            />
          ) : (
            <p className="text-gray-500">Loading skill data...</p>
          )}
        </div>
      )}
    </>
  );
};

export default ApplyJobPage;