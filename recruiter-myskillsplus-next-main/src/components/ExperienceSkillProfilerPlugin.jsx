"use client";

import React, { useEffect } from "react";

const ExperienceSkillProfilerPlugin = () => {

  useEffect(() => {
    localStorage.setItem('iys', JSON.stringify({
      page:"Home",
      tap: "all",
      profile_view: "all",
      isEdit: true,
      isDelete: true,
      doughnt: true, 
      experience: true
    }));
  }, []);

  return (
    <>
      <section id="experience-plugin-section">
        <div className="container mx-auto">
          <div className="d-flex flex-column align-items-center justify-content-between">
            <div className="col-12" style={{ height: "78vh" }}>
              {/* Auth / No-Auth */}
              <iframe
                style={{ borderRadius: "10px", height: "100%", width: "100%" }}
                src="/plugins/allinone/index.html"
                title="IYS Plugin Rating"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ExperienceSkillProfilerPlugin;
