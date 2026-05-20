'use client'

import React from 'react';
import CookieConsent from 'react-cookie-consent';

const GDPRCookieConsent = () => {
  const bannerStyle = {
    background: "#222",
    color: "#fff",
    padding: "15px",
    textAlign: "center",
    fontSize: "16px",
  };

  const buttonStyle = {
    background: "#f8f8f8",
    color: "#000",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  };

  return (
    <CookieConsent
      location="bottom"
      buttonText="I Accept"
      cookieName="newCookieName"
      style={bannerStyle}
      buttonStyle={buttonStyle}
    >
      This website uses cookies to ensure you get the best experience on our website.
    </CookieConsent>
  );
};

export default GDPRCookieConsent;
