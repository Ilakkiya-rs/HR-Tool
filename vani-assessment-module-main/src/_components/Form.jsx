'use client';

import React, { useState } from 'react';
import RenderSkillItems from './RenderSkillItems';
import LoaderOverlay from "./LoaderOverlay";
import AssessmentRenderer from './AssessmentRenderer';
import { API_BASE } from '../config/api';

const Form = ({ initialData, onSubmitSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [finalAssessment, setFinalAssessment] = useState(null);

  const [personalInfo, setPersonalInfo] = useState(
    initialData?.personalInfo || {
      name: '',
      email: '',
      role: ''
    }
  );

  // Initialize skill categories with initial data if available
  const [skillCategories, setSkillCategories] = useState(
    initialData?.skillCategories || {
      "Concepts": [{ name: '', proficiency: null, comment: '', id: generateId(), skill_id: generateSkillId() }],
      "Applied Skills": [{ name: '', proficiency: null, comment: '', id: generateId(), skill_id: generateSkillId() }],
      "Tools": [{ name: '', proficiency: null, comment: '', id: generateId(), skill_id: generateSkillId() }],
      "Soft Skills": [{ name: '', proficiency: null, comment: '', id: generateId(), skill_id: generateSkillId() }],
      "Certifications": [{ name: '', proficiency: null, comment: '', id: generateId(), skill_id: generateSkillId() }],
      "Domain": [{ name: '', proficiency: null, comment: '', id: generateId(), skill_id: generateSkillId() }]
    }
  );

  // Generate random ID for new skills
  function generateId() {
    return Math.floor(Math.random() * 1000);
  }

  // Generate random skill_id for new skills
  function generateSkillId() {
    return Array.from(Array(64), () => Math.floor(Math.random() * 16).toString(16)).join('');
  }

  // Handle personal info changes
  const handlePersonalInfoChange = (e) => {
    const { id, value } = e.target;
    setPersonalInfo({
      ...personalInfo,
      [id]: value
    });
  };

  // Handle skill name change
  const handleSkillNameChange = (category, index, value) => {
    const updatedSkills = [...skillCategories[category]];
    updatedSkills[index] = { ...updatedSkills[index], name: value };
    setSkillCategories({
      ...skillCategories,
      [category]: updatedSkills
    });
  };

  // Handle proficiency rating change
  const handleProficiencyChange = (category, index, value) => {
    const updatedSkills = [...skillCategories[category]];
    updatedSkills[index] = { ...updatedSkills[index], proficiency: value };
    setSkillCategories({
      ...skillCategories,
      [category]: updatedSkills
    });
  };

  // Handle comment change
  const handleCommentChange = (category, index, value) => {
    const updatedSkills = [...skillCategories[category]];
    updatedSkills[index] = { ...updatedSkills[index], comment: value };
    setSkillCategories({
      ...skillCategories,
      [category]: updatedSkills
    });
  };

  // Add a new skill to a category
  const addSkill = (category) => {
    setSkillCategories({
      ...skillCategories,
      [category]: [...skillCategories[category], { 
        name: '', 
        proficiency: null,
        comment: '',
        id: generateId(),
        skill_id: generateSkillId()
      }]
    });
  };

  // Remove a skill from a category
  const removeSkill = (category, index) => {
    const updatedSkills = [...skillCategories[category]];
    updatedSkills.splice(index, 1);
    setSkillCategories({
      ...skillCategories,
      [category]: updatedSkills
    });
  };

  // Format skills for backend API
  const formatSkillsForBackend = (skillCategoriesObj) => {
    const formattedSkills = [];
    
    Object.keys(skillCategoriesObj).forEach(category => {
      skillCategoriesObj[category].forEach(skill => {
        if (skill.name && skill.proficiency) {
          formattedSkills.push({
            skill_name: skill.name,
            id: skill.id || generateId(),
            skill_id: skill.skill_id || generateSkillId(),
            tag_name: category,
            rating: skill.proficiency,
            comment: skill.comment || "",
            proxy_skill: null
          });
        }
      });
    });
    
    return formattedSkills;
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Format skills for the backend
    const formattedSkills = formatSkillsForBackend(skillCategories);

    setIsProcessing(true);
    
    try {
      const response = await fetch(`${API_BASE}/vani-generate-assessment/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skills: formattedSkills,
          profileData: personalInfo,
          testLength: 5,
          timeLimit: 20,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate assessment');
      }

      const assessmentData = await response.json();
      setIsProcessing(false);
      
      // Save the user data and assessment data for future use
      const userData = {
        personalInfo: personalInfo,
        skillCategories: skillCategories
      };
      
      // Call the callback with both user data and assessment data
      onSubmitSuccess(userData, assessmentData);
      
    } catch (error) {
      setIsProcessing(false);
      alert('There was an error generating your assessment. Please try again.');
    }
  };

  const categoryIcons = {
    "Concepts": "🧠",
    "Applied Skills": "⚡",
    "Tools": "🛠️",
    "Soft Skills": "💬",
    "Certifications": "🏆",
    "Domain": "🎯"
  };

  const categoryColors = {
    "Concepts": "from-violet-600 via-purple-600 to-blue-600",
    "Applied Skills": "from-blue-600 via-cyan-600 to-teal-600",
    "Tools": "from-teal-600 via-emerald-600 to-green-600",
    "Soft Skills": "from-pink-600 via-rose-600 to-[#E53935]",
    "Certifications": "from-amber-600 via-yellow-600 to-orange-600",
    "Domain": "from-indigo-600 via-blue-600 to-cyan-600"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-8 -left-4 w-80 h-80 bg-gradient-to-br from-cyan-200 to-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-500"></div>
      </div>

      {(!isProcessing && finalAssessment) ? (
        <AssessmentRenderer assessmentData={finalAssessment} />
      ) : (
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-2xl mb-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 mb-6 leading-tight">
              Skills Profiler
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
              Unlock your potential with a comprehensive skills interview. Document your expertise and receive personalized insights to accelerate your career growth.
            </p>
          </div>

          {/* Personal Information Section */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 mb-12 border border-white/50 hover:shadow-3xl transition-all duration-500">
            <div className="flex items-center mb-8">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl mr-6 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-800">Personal Information</h2>
                <p className="text-slate-600 mt-1">Tell us a bit about yourself to get started</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-3">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    id="name"
                    className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-slate-800 placeholder-slate-400"
                    value={personalInfo.name}
                    onChange={handlePersonalInfoChange}
                  />
                </div>
              </div>
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-3">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    id="email"
                    className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-slate-800 placeholder-slate-400"
                    value={personalInfo.email}
                    onChange={handlePersonalInfoChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Skills Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {Object.keys(skillCategories).map((category, index) => (
                <div 
                  key={category} 
                  className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden border border-white/30 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] group"
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <div className={`bg-gradient-to-r ${categoryColors[category]} p-6 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                    <div className="relative z-10 flex items-center">
                      <span className="text-4xl mr-4 transform group-hover:scale-110 transition-transform duration-300">{categoryIcons[category]}</span>
                      <div>
                        <h3 className="text-2xl font-bold text-white drop-shadow-sm">
                          {category}
                        </h3>
                        <p className="text-white/80 text-sm mt-1">Build your expertise profile</p>
                      </div>
                    </div>
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full"></div>
                    <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full"></div>
                  </div>
                  <div className="p-8">
                    <RenderSkillItems
                      category={category}
                      displayName={category}
                      skills={skillCategories[category]}
                      onSkillNameChange={handleSkillNameChange}
                      onProficiencyChange={handleProficiencyChange}
                      onCommentChange={handleCommentChange}
                      onAddSkill={addSkill}
                      onRemoveSkill={removeSkill}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Rating Guide */}
            <div className="bg-gradient-to-br from-blue-50/80 via-indigo-50/80 to-purple-50/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl mb-12 border border-white/30">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-slate-800 mb-2">Proficiency Rating Guide</h3>
                <p className="text-slate-600">Use this guide to accurately rate your skill levels</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { level: "Basic", stars: 1, color: "from-[#EF5350] to-[#F44336]", description: "Foundational understanding, needs guidance for most tasks" },
                  { level: "Intermediate", stars: 2, color: "from-yellow-400 to-yellow-500", description: "Can perform routine tasks independently, may need help with complex tasks" },
                  { level: "Advanced", stars: 3, color: "from-blue-400 to-blue-500", description: "Can handle complex tasks and guide others" },
                  { level: "Expert", stars: 4, color: "from-green-400 to-green-500", description: "Deep expertise, can solve novel problems and innovate" }
                ].map((rating, index) => (
                  <div key={rating.level} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center mb-3">
                      <div className="flex mr-3">
                        {[...Array(4)].map((_, i) => (
                          <span key={i} className={`text-lg ${i < rating.stars ? 'text-yellow-400' : 'text-[#E0E0E0]'}`}>★</span>
                        ))}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-white text-sm font-bold bg-gradient-to-r ${rating.color} shadow-md`}>
                        {rating.level}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{rating.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="group relative px-12 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white font-bold text-xl rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 focus:outline-none focus:ring-4 focus:ring-purple-300/50 transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-2xl hover:shadow-3xl"
              >
                <span className="relative z-10 flex items-center">
                  <svg className="w-6 h-6 mr-3 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate Skills Assessment
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              </button>
            </div>
          </form>

          <LoaderOverlay isLoading={isProcessing} />
        </div>
      )}
    </div>
  );
};

export default Form;