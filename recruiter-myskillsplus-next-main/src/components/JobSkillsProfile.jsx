"use client";

import React, { useState, useEffect } from "react";

const JobSkillsProfile = ({ activeJob, user }) => {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  useEffect(() => {

    const fetchSkills = async () => {
        try {
            // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/get-user-rated-skills/${user.individual_profile_id}/${activeJob.id}`);
            const res = await fetch(`https://api.myskillsplus.com/get-user-rated-skills/${user.individual_profile_id}/${activeJob.id}`);
            if (!res.ok) throw new Error('Failed to fetch skills');
            const data = await res.json();
            localStorage.setItem('userRatedSkills', JSON.stringify(data));
            console.log('Skills fetched and stored in localStorage:', data);
            setIsDataLoaded(true);
        } catch (error) {
            console.error('Error fetching skills:', error);
        }
    };
    fetchSkills();
    // Initialize localStorage for the plugin
    localStorage.setItem('iys', JSON.stringify({
      page:"Home",
      tap: "profile",
      profile_view: "all",
      isEdit: false,
      isDelete: false,
      doughnt: true, 
      experience: true
    }));
  }, []);
  
  return (
    <section id="experience-plugin-section">
      <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg sm:text-xl font-semibold">{activeJob?.job_title} Skills Profile</h2>
      </div>
      <div className="container mx-auto">
        <div className="d-flex flex-column align-items-center justify-content-between">
          <div className="col-12" style={{ height: "78vh" }}>
            {/* Render iframe only after data is loaded */}
            {isDataLoaded ? (
              <iframe
                style={{ borderRadius: "10px", height: "100%", width: "100%" }}
                src="/plugins/allinone/index.html"
                title="IYS Plugin Rating"
              />
            ) : (
              <p>Loading skills data...</p> // Show a loading message while data is being fetched
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobSkillsProfile;
