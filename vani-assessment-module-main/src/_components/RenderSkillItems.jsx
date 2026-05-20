'use client';
import React, { useState } from 'react';
import StarRating from './StarRating';

const RenderSkillItems = ({ 
  category, 
  displayName, 
  skills, 
  onSkillNameChange, 
  onProficiencyChange, 
  onCommentChange,
  onAddSkill, 
  onRemoveSkill 
}) => {
  // State to track which skills have their comment boxes open
  const [openComments, setOpenComments] = useState({});

  // Category-specific button colors
  const categoryButtonColors = {
    "Concepts": {
      inactive: "bg-blue-50 text-blue-600 hover:bg-blue-100",
      active: "bg-blue-100 text-blue-700 hover:bg-blue-200"
    },
    "Applied Skills": {
      inactive: "bg-purple-50 text-purple-600 hover:bg-purple-100",
      active: "bg-purple-100 text-purple-700 hover:bg-purple-200"
    },
    "Tools": {
      inactive: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
      active: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
    },
    "Soft Skills": {
      inactive: "bg-pink-50 text-pink-600 hover:bg-pink-100",
      active: "bg-pink-100 text-pink-700 hover:bg-pink-200"
    },
    "Certifications": {
      inactive: "bg-yellow-50 text-yellow-600 hover:bg-yellow-100",
      active: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
    },
    "Domain": {
      inactive: "bg-sky-50 text-sky-600 hover:bg-sky-100",
      active: "bg-sky-100 text-sky-700 hover:bg-sky-200"
    }
  };

  // Toggle comment box for a specific skill
  const toggleComment = (skillIndex) => {
    setOpenComments(prev => ({
      ...prev,
      [`${category}-${skillIndex}`]: !prev[`${category}-${skillIndex}`]
    }));
  };

  return (
    <div>
      {skills.map((skill, index) => (
        <div key={`${category}-${index}`} className="skill-item border border-[#EEEEEE] rounded-md p-4 mb-4">
          <div className="flex flex-col gap-4">
            {/* Skill Name, Rating, and Comment Button Row */}
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-grow">
                <input
                  type="text"
                  placeholder={`Enter ${displayName} name`}
                  className="w-full px-3 py-2 border border-[#E0E0E0] rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={skill.name}
                  onChange={(e) => onSkillNameChange(category, index, e.target.value)}
                />
              </div>
              <div className="flex-shrink-0">
                <StarRating 
                  maxStars={4} 
                  rating={skill.proficiency || 0} 
                  onRatingChange={(rating) => onProficiencyChange(category, index, rating)} 
                />
              </div>
              {skills.length > 1 && (
                <div className="flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => onRemoveSkill(category, index)}
                    className="text-[#F44336] hover:text-[#D32F2F]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onAddSkill(category)}
        className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors"
      >
        + Add Another {displayName}
      </button>
    </div>
  );
};

export default RenderSkillItems;

