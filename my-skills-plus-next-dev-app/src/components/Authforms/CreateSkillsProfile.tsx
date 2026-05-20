"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import Header from "@/components/Header/HomeHeader";
import Image from "next/image";
import ExperienceHomePlugin from "../ExperienceHomePlugin";
import HomePageContent from "../HomePageContent";
import { FaYoutube } from "react-icons/fa";

interface ExperienceSelection {
  checked: boolean;
  years?: string;
}

type ExperienceState = {
  [id: number]: ExperienceSelection;
};

const CreateSkillsProfile = () => {

  const [showButton, setShowButton] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const experienceOptions = [
    { id: 1, label: "I am a student currently pursuing education", input: false },
    { id: 2, label: "I am starting my career", input: false },
    { id: 3, label: "I have been in full-time employment", input: true },
    { id: 4, label: "I have been doing project/freelance/avocational work", input: true },
    { id: 5, label: "I am currently not employed, but have prior work experience", input: true },
    { id: 6, label: "I engage in non-paid work regularly (volunteering, caregiving, etc.)", input: false },
  ];
  const [selected, setSelected] = useState<ExperienceState>({});
  const isFresherSelected = selected[1]?.checked || selected[2]?.checked;
  const handleChange = (id: number, value: boolean) => {
    if (!value) {
      setSelected({});
      return;
    }
    setSelected({ [id]: { checked: true, years: selected[id]?.years || "" } });
    // setSelected((prev) => ({ ...prev, [id]: { ...prev[id], checked: value } }));
  };
  const handleYearChange = (id: number, value: string) => {
    setSelected((prev) => ({ ...prev, [id]: { ...prev[id], years: value } }));
  };
  const [showVideo, setShowVideo] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  useEffect(() => {
    const handleLocalStorageChange = () => {
      const savedSkills = localStorage.getItem("userRatedSkills");

      if (!savedSkills) return;

      let userRatedSkillsJson;
      try {
        userRatedSkillsJson = JSON.parse(savedSkills);
      } catch (err) {
        console.error("Invalid userRatedSkills JSON:", err);
        return;
      }

      if (!Array.isArray(userRatedSkillsJson) || userRatedSkillsJson.length === 0) {
        setShowButton(false);
        return;
      }

      setShowButton(true);

      const allSkillsRated = userRatedSkillsJson.every((skill: any) => {
        const ratingsArray = skill.rating;
        if (!Array.isArray(ratingsArray) || ratingsArray.length === 0) return false;
        return ratingsArray.every((r) => r.rating && r.rating !== "");
      });

      setButtonDisabled(!allSkillsRated);
    };
    const urlParams = new URLSearchParams(window.location.search);
    const referralCode = urlParams.get("referralCode");
    const partnerId = urlParams.get("partnerId");
    const searchSkill = urlParams.get("searchSkill");

    if (referralCode) {
      sessionStorage.setItem("referralCode", referralCode);
      if (partnerId) {
        sessionStorage.setItem("partnerId", partnerId);
      }
      console.log("Stored referral code:", referralCode);
      console.log("Stored partner ID:", partnerId);
    }
    if (searchSkill) {
      localStorage.setItem("searchSkill", searchSkill);
      console.log("Stored search skill:", searchSkill);
    }
    handleLocalStorageChange();
    window.addEventListener("storage", handleLocalStorageChange);

    return () => {
      window.removeEventListener("storage", handleLocalStorageChange);
      localStorage.removeItem("Config");
      localStorage.removeItem("searchSkill");
    };
  }, []);

  const handleExperienceSubmit = () => {
    const selectedExperience = experienceOptions
      .filter((opt) => selected[opt.id]?.checked)
      .map((opt) => ({
        label: opt.label,
        years: opt.input ? selected[opt.id]?.years || "" : undefined,
      }));
  
    if (selectedExperience.length === 0) {
      alert("Please select at least one experience option.");
      return;
    }
  
    localStorage.setItem("current_experience_level", JSON.stringify(selectedExperience));
    alert("Experience level saved!");
  };  

  return (
    <>
      <Header sidebarOpen={false} />
      <ToastContainer />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="p-6 pb-0 text-center">
          <h3 className="mt-2 text-3xl font-bold text-black dark:text-white">Build Your Skills Profile</h3>
        </div>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 p-6 pb-0 text-center">
          {/* Step 1 */}
          <div className="relative flex flex-col items-center bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 w-full max-w-xs hover:scale-105 transition">
            <div className="text-blue-600 text-xl font-semibold mb-2">Step 1</div>
            <h3 className="text-2xl font-bold text-black dark:text-white">Browse</h3>
            <p className="text-sm text-black">Function/Industry/Sub-Areas in line with you career path</p>
          </div>
          {/* Step 2 */}
          <div className="relative flex flex-col items-center bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 w-full max-w-xs hover:scale-105 transition">
            <div className="text-blue-600 text-xl font-semibold mb-2">Step 2</div>
            <h3 className="text-2xl font-bold text-black dark:text-white">Select</h3>
            <p className="text-sm text-black">Skills across different dimensions that make one profile complete</p>
          </div>
          {/* Step 3 */}
          <div className="flex flex-col items-center bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 w-full max-w-xs hover:scale-105 transition">
            <div className="text-blue-600 text-xl font-semibold mb-2">Step 3</div>
            <h3 className="text-2xl font-bold text-black dark:text-white">Rate</h3>
            <p className="text-sm text-black">Rate proficiencies on the skills and Qualify them with comments</p>
          </div>
        </div>
        {/* <div className="p-4 pb-0 text-center">
          <div className="flex items-center gap-2 justify-center">
            <h6 className="text-xl font-bold blink-glow">Tips for Profiling</h6>
          </div>
          <div className="flex justify-center mt-2 mb-4 cursor-pointer" onClick={() => setShowVideo(true)}>
            <FaYoutube className="text-red w-12 h-12" />
          </div>
        </div> */}
        {showVideo && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-2 relative">
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
                onClick={() => setShowVideo(false)}
              >
                &times;
              </button>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  width="100%"
                  height="400"
                  src="https://www.youtube.com/embed/jxTOSNhF-9A"
                  title="Tips for Profiling"
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}
        <section className="mx-auto container experienceSection p-3 lg:p-8 shadow-lg mb-4 lg:border lg:border-[#F5F5F5] rounded-lg">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-xl font-semibold text-center mb-2">Before we begin…</h3>
            <p className="text-sm text-center mb-6">
              Tell us about your current experience level<br />
              <span className="text-xs">(This helps tailor your profile experience and skill suggestions)</span>
            </p>
            <div className="flex flex-wrap gap-6 text-sm">
              {experienceOptions.map((opt) => (
                <div key={opt.id} className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-gray-800">
                    <input
                      type="checkbox"
                      className="accent-blue-600 w-4 h-4"
                      checked={selected[opt.id]?.checked || false}
                      onChange={(e) => handleChange(opt.id, e.target.checked)}
                    />
                    {opt.label}
                  </label>

                  {opt.input && selected[opt.id]?.checked && (
                    <input
                      type="number"
                      placeholder="Years"
                      className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                      value={selected[opt.id]?.years || ""}
                      onChange={(e) => handleYearChange(opt.id, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6">
            <button
              type="button"
              onClick={handleExperienceSubmit}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Start Building Skills Profile
            </button>
            </div>
          </div>
        </section>
        <section className="mx-auto container experienceSection p-3 lg:p-8 shadow-lg mb-4 lg:border lg:border-[#F5F5F5] rounded-lg">
          <div className="">
            <HomePageContent plugin={isFresherSelected ? "fresher" : "experience"} />
          </div>
        </section>
      </div>
      {showButton && (
        <>
          <button
            onClick={(e) => {
              e.preventDefault();
              if (buttonDisabled) {
                alert("Please rate all selected skills before proceeding.");
                return;
              }
              setShowReviewModal(true); // Show modal
            }}
            className={`fixed bottom-10 right-10 rounded-full border-2 px-3 py-1 text-lg font-bold shadow-lg transition
              ${buttonDisabled
                ? "bg-[#BDBDBD] text-white"
                : "bg-blue-500 text-white shadow-blue-500/50 border-gradient"
              }`}
          >
            Save Profile
          </button>
        </>
      )}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center sm:p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-xl w-full p-6 text-black">
            <h2 className="text-2xl font-bold mb-4">⚠ Review Your Skills Profile Before Saving</h2>
            <p className="mb-4 text-sm text-[#616161]">
              A high-trust profile increases your credibility and visibility. Please review the points below before submitting:
            </p>

            <ul className="text-sm space-y-2 list-disc pl-5">
              <li><strong>Limit your Hard Skills:</strong> 20–30 if experienced, 10–20 if early-career</li>
              <li><strong>Add 5–10 Personal Attributes</strong></li>
              <li><strong>Include Language Proficiencies</strong> for global or customer-facing roles</li>
              <li><strong>Avoid Rating All Skills as Level 4</strong>. Be honest and realistic.</li>
              <li><strong>Support Your Ratings with Comments</strong> for better trust.</li>
            </ul>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 text-sm rounded-lg bg-[#EEEEEE] hover:bg-[#E0E0E0]"
              >
                Go Back and Review
              </button>
              <Link href="/auth/signup">
                <button className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700">
                  Continue to Save
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateSkillsProfile;