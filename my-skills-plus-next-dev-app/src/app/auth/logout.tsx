"use client";
import React, { useState } from "react";

const Logout = () => {
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem("tokenData");
      localStorage.removeItem("loginUserDetail");
      localStorage.removeItem("logginUserRatedSkills");
      localStorage.removeItem("activeNav");
      localStorage.removeItem("current_experience_level");
      document.cookie =
        "iysauth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.location.reload();
    }, 1000);
  };

  return (
    <>
      <div
        onClick={() => {
          handleLogout();
        }}
      >
        {loggingOut ? "Logging out" : "Logout"}
      </div>
    </>
  );
};

export default Logout;
