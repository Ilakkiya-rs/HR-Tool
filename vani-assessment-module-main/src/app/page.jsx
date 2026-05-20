'use client';

import React, { useState, useEffect } from 'react';
import Form from "../_components/Form";
import AssessmentRenderer from "../_components/AssessmentRenderer";
import { API_BASE } from "../config/api";

const Home = () => {
  const [showForm, setShowForm] = useState(true);
  const [assessmentData, setAssessmentData] = useState(null);
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

  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage({ type: "ASSESSMENT_WINDOW_READY" }, "*");
    }
    const handleMessage = (event) => {
      console.log("Received message in assessment app:", event.data);
      const { type, skills, user } = event.data;
      if (type === "TRIGGER_ASSESSMENT") {
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
      return;
    }
    // console.log("Formatted Skills:", formattedSkills);
    setIsProcessing(true);
    try {
      const personalInfo = {
        individual_profile_id: user.individual_profile_id,
        name: user.name || user.personalInfo?.name || "",
        email: user.email || user.personalInfo?.email || "",
      };

      if (!personalInfo.email) {
        console.error("Assessment requires user email in profileData");
        return;
      }

      const response = await fetch(`${API_BASE}/vani-generate-assessment/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skills: formattedSkills,
          profileData: personalInfo,
          testLength: 5,
          timeLimit: 20,
        }),
      });

      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      setAssessmentData(data);
      setShowForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFormSubmit = (userData, assessment) => {
    setSavedUserData(userData);
    setAssessmentData(assessment);
    setShowForm(false);
  };

  return (
    <div className="w-screen">
      {isProcessing ? (
        <div className="text-center text-lg font-bold">Generating...</div>
      ) : showForm ? (
        <Form 
          initialData={savedUserData} 
          onSubmitSuccess={handleFormSubmit} 
        />
      ) : (
        <AssessmentRenderer 
          assessmentData={assessmentData}
          userData={savedUserData}
        />
      )}
    </div>
  );
}

export default Home;