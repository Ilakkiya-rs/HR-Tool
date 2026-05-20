"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ErrorDialog from "../../../../components/ErrorDialog";
import Loader from "../../../../components/Loader";
import ResumeInterview from "../../../../components/ResumeInterview";
import TermsAndConditions from "../../../../components/TermsAndConditions";

export default function Verify() {
  const { token } = useParams();

  const [formData, setFormData] = useState({ name: "", email: "" });
  const [languageCode, setLanguageCode] = useState("en-US");
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");
  const [mode, setMode] = useState("form");

  const [hasProfileId, setHasProfileId] = useState(false);
  const [jobData, setJobData] = useState(null);
  const [skills, setSkills] = useState([]);

  const LANGUAGES = [
    { code: "en-US", name: "English" },
    { code: "bn-IN", name: "Bengali" },
    { code: "gu-IN", name: "Gujarati" },
    { code: "hi-IN", name: "Hindi" },
    { code: "kn-IN", name: "Kannada" },
    { code: "ml-IN", name: "Malayalam" },
    { code: "mr-IN", name: "Marathi" },
    { code: "ta-IN", name: "Tamil" },
    { code: "te-IN", name: "Telugu" },
    { code: "ur-IN", name: "Urdu" },
  ];

  // Load localStorage data once
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const storedSkills = JSON.parse(localStorage.getItem("userSkills") || "[]");
    setSkills(storedSkills);

    if (userData?.individual_profile_id && userData?.name && userData?.email) {
      // Case 1 → Autofill name & email, mark as readonly
      setFormData({ individual_profile_id: userData.individual_profile_id ||"", name: userData.name || "", email: userData.email || "" });
      setHasProfileId(true);
    } else if (userData?.job_id && userData?.job_title && userData?.recruiter_id) {
      // Case 2 → Job-related data
      setJobData(userData);
      setHasProfileId(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!languageCode.trim()) newErrors.language = "Please choose language first";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!token) return;

    if (!validateForm()) {
      setIsProcessing(false);
      return;
    }

    let payload = {
      name: formData.name,
      email: formData.email,
      language: languageCode,
    };

    if(hasProfileId){
      payload.individual_profile_id = formData.individual_profile_id
    }

    // Case 2: No profile id → Add job info
    if (!hasProfileId && jobData) {
      payload.job_id = jobData.job_id;
      payload.job_title = jobData.job_title;
      payload.recruiter_id = jobData.recruiter_id;
    }

    try {
      const response = await fetch(
        `https://api.myskillsplus.com/skills/interview_link/${token}/`,
        // `http://127.0.0.1:8000/skills/interview_link/${token}/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Something went wrong");
        setType("error");
        setIsProcessing(false);
      } else {
        setMessage(data.message);
        setType("success");

        // If Case 2 → also call save-candidate-profile API
        if (!hasProfileId && jobData) {
          try {
            const candidatePayload = new FormData();
            candidatePayload.append("job_id", jobData.job_id);
            candidatePayload.append("job_title", jobData.job_title);
            candidatePayload.append("name", formData.name);
            candidatePayload.append("email", formData.email);
            candidatePayload.append("recruiter_id", jobData.recruiter_id);
            candidatePayload.append("rated_skills", JSON.stringify(skills));

            const res = await fetch(
              "https://api.myskillsplus.com/save-candidate-profile/",
              // "http://127.0.0.1:8000/save-candidate-profile/",
              {
                method: "POST",
                body: candidatePayload,
              }
            );

            if (res.ok) {
              alert("Successfully candidates details also saved");
            } else {
              alert("Something went wrong while saving candidate profile");
            }
          } catch (err) {
            console.error("Save candidate error:", err);
          }
        }

        setTimeout(() => {
          if (data?.phase) {
            setMode(data.phase);
          }
        }, 2000);
      }
    } catch (err) {
      setMessage("An error occurred. Please try again....");
      setType("error");
    } finally {
      setIsProcessing(false);
    }
  };

  // ================= RENDER =================
  if (mode === "form") {
    return (
      <div className="w-screen min-h-screen flex items-center justify-center bg-[#FAFAFA] py-12">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-center text-[#424242] mb-6">
            Enter Your Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-[#616161] mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                readOnly={hasProfileId}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg ${
                  errors.name ? "border-[#F44336]" : "border-[#E0E0E0]"
                }`}
              />
              {errors.name && (
                <p className="text-[#F44336] text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#616161] mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly={hasProfileId}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg ${
                  errors.email ? "border-[#F44336]" : "border-[#E0E0E0]"
                }`}
              />
              {errors.email && (
                <p className="text-[#F44336] text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-medium">Select Language</label>
              <select
                value={languageCode}
                onChange={(e) => setLanguageCode(e.target.value)}
                className="mt-1 w-full border rounded-lg p-2"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white font-bold text-xl rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800"
            >
              {isProcessing ? "Submitting..." : "Submit"}
            </button>
          </form>
          <Loader isLoading={isProcessing} />
          <ErrorDialog
            message={message}
            type={type}
            onClose={() => setMessage("")}
          />
        </div>
      </div>
    );
  }

  if (mode === "resume") {
    return (
      <ResumeInterview
        token={token}
        email={formData.email}
        name={formData.name}
        languageCode={languageCode}
      />
    );
  }

  if (mode === "continue") {
    return (
      <TermsAndConditions
        token={token}
        email={formData.email}
        languageCode={languageCode}
      />
    );
  }
}