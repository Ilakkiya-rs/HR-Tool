'use client';

import React, { useState, useEffect } from 'react';
import Form from "./_components/Form";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../config/api";
import "./skills-entry.css";

const Home = () => {
  const [standalone] = useState(
    () => typeof window !== "undefined" && !window.opener
  );
  const [savedUserData, setSavedUserData] = useState({
    personalInfo: {
      name: '',
      email: ''
    },
    skillCategories: {
      "Concepts": [{ name: '', proficiency: null, id: Math.floor(Math.random() * 1000), skill_id: Array.from(Array(64), () => Math.floor(Math.random() * 16).toString(16)).join('') }],
      "Applied Skills": [{ name: '', proficiency: null, id: Math.floor(Math.random() * 1000), skill_id: Array.from(Array(64), () => Math.floor(Math.random() * 16).toString(16)).join('') }],
      "Tools": [{ name: '', proficiency: null, id: Math.floor(Math.random() * 1000), skill_id: Array.from(Array(64), () => Math.floor(Math.random() * 16).toString(16)).join('') }],
      "Soft Skills": [{ name: '', proficiency: null, id: Math.floor(Math.random() * 1000), skill_id: Array.from(Array(64), () => Math.floor(Math.random() * 16).toString(16)).join('') }],
      "Certifications": [{ name: '', proficiency: null, id: Math.floor(Math.random() * 1000), skill_id: Array.from(Array(64), () => Math.floor(Math.random() * 16).toString(16)).join('') }],
      "Domain": [{ name: '', proficiency: null, id: Math.floor(Math.random() * 1000), skill_id: Array.from(Array(64), () => Math.floor(Math.random() * 16).toString(16)).join('') }],
    }
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage({ type: "ASSESSMENT_WINDOW_READY" }, "*");
    }
    const handleMessage = (event) => {
      console.log("Received message in assessment app:", event.data);
      const { type, skills, user } = event.data;
      if (type === "TRIGGER_ASSESSMENT") {
        localStorage.setItem('userSkills', JSON.stringify(skills));
        localStorage.setItem('userData', JSON.stringify(user));
        setSavedUserData(user);
        generateAssessment(skills, user);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);  

  const formatSkillsForBackend = (storedUserSkills) => {
    const formattedSkills = [];
    const allowedCategories = ["Concepts", "Tools", "Applied Skills"];
    storedUserSkills.forEach((item) => {
      const tagTitles = item.isot_file?.tags?.map(tag => tag.title) || [];
      const matchingTag = tagTitles.find(title => allowedCategories.includes(title));
      if (!matchingTag) return;

      item.rating.forEach((ratingEntry) => {
        formattedSkills.push({
          skill_name: item.isot_file.name,
          id: item.id,
          skill_id: item.isot_path_addr,
          tag_name: matchingTag,
          rating: ratingEntry.rating,
          comment: ratingEntry.comment || "",
          proxy_skill: item.isot_file?.proxy_skill || null
        });
      });
    });
    return formattedSkills;
  };

  const generateAssessment = async (skills, user) => {
    const formattedSkills = formatSkillsForBackend(skills);
    if (!formattedSkills.length) {
      setIsProcessing(false);
      setMessage("No valid skills found.");
      setType("error");
      return;
    }
  
    setIsProcessing(true);
    try {
      const personalInfo = {
        ...(user.individual_profile_id && {
          individual_profile_id: user.individual_profile_id,
        }),
        ...(user.name && { name: user.name }),
        ...(user.email && { email: user.email }),
        ...(user.recruiter_id && { recruiter_id: user.recruiter_id }),
        ...(user.job_id && { job_id: user.job_id }),
        ...(user.job_title && { job_title: user.job_title }),
      };
  
      if (!personalInfo.email) {
        setMessage("User email is required. Open assessment from the main app with a logged-in user.");
        setType("error");
        setIsProcessing(false);
        return;
      }

      const response = await fetch(
        `${API_BASE}/skills/generate-assessment/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            skills: formattedSkills,
            profileData: personalInfo,
            testLength: 5,
            timeLimit: 20,
          }),
        }
      );
  
      const assessmentData = await response.json();
  
      if (!response.ok) {
        setMessage(assessmentData.error || "API Error");
        setType("error");
      } else {
        // console.log("Assessment Data:", assessmentData);
        navigate(`/skills/interview/${assessmentData.token}`);
        // OR full reload: window.location.href = `/skills/interview/${assessmentData.token}`;
        setMessage(assessmentData.message);
        setType("success");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setMessage(
        "There was an error in generating your assessment. Please try again..."
      );
      setType("error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="skills-entry-shell">
      {standalone ? (
        <div className="skills-entry-banner" role="status">
          <strong>Vani · Skills assessment</strong> — You opened this URL directly. Use the form
          below, or start from the{" "}
          <a href="http://localhost:3099/" target="_blank" rel="noopener noreferrer">
            local portal
          </a>{" "}
          / MySkillsPlus app so profile skills can load automatically.
        </div>
      ) : null}
      <div className="skills-entry-inner">
        {isProcessing ? (
          <div className="text-center text-lg font-bold text-white py-16">Generating…</div>
        ) : (
          <Form />
        )}
        {message ? (
          <div
            className={`px-4 py-3 text-center text-sm font-medium ${
              type === "error" ? "bg-red-950 text-red-200" : "bg-emerald-950 text-emerald-200"
            }`}
          >
            {message}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Home;